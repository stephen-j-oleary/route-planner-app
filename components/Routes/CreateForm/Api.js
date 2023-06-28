import { isEmpty } from "lodash";
import { useRouter } from "next/router";

import CreateRouteFormLogic from "./Logic";
import useDeferred from "@/shared/hooks/useDeferred";
import useRouterQuery from "@/shared/hooks/useRouterQuery";
import Stop from "@/shared/models/Stop";
import { useCreateLocalStorageRoute } from "@/shared/reactQuery/useLocalStorageRoutes";
import { selectUser, useGetSession } from "@/shared/reactQuery/useSession";
import { getDirections } from "@/shared/services/directions";


export default function CreateRouteFormApi(props) {
  const router = useRouter();
  const authUser = useGetSession({ select: selectUser });
  const handleStoreRoute = useCreateLocalStorageRoute();

  const query = useRouterQuery();
  const stops = query.get("stops", []);
  const origin = +query.get("origin", 0);
  const destination = +query.get("destination", 0);
  const stopTime = +query.get("stopTime", 0);

  const getDefaultStops = () => {
    const defStops = stops.map(value => new Stop({ value }));
    defStops.length = Math.max(stops.length, Stop.MINIMUM_STOPS);

    return defStops
      .fill(null, stops.length)
      .map(stop => (stop ?? new Stop()));
  };

  const defaultValues = useDeferred(
    query.isReady,
    {
      stops: getDefaultStops(),
      origin,
      destination,
      stopTime,
    }
  );


  const handleSubmit = async formData => {
    const { origin, destination } = formData;

    const stops = formData.stops
      .map(({ value }) => encodeURIComponent(value))
      .map((v, i) => ([
        ...(i === +origin ? ["type:origin"] : []),
        ...(i === +destination ? ["type:destination"] : []),
        v
      ].join(";")))
      .filter(item => !isEmpty(item))
      .join("|");

    const { routes } = await getDirections({ stops }).catch(err => {
      throw new Error(err.response?.data?.message || err.message || "An error occurred");
    });
    if (routes.length === 0) throw new Error("No routes found");

    const route = routes[0];

    return await handleStoreRoute.mutateAsync({
      userId: authUser.data?._id,
      editUrl: router.asPath,
      stops: formData.stops,
      stopTime: formData.stopTime,
      bounds: route.bounds,
      copyright: route.copyright,
      legs: route.legs,
      polyline: route.polyline,
      stopOrder: route.stopOrder,
    });
  };

  return (
    <CreateRouteFormLogic
      defaultValues={defaultValues.execute}
      onSubmit={handleSubmit}
      {...props}
    />
  );
}