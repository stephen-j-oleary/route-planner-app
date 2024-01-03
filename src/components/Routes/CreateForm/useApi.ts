import { isArray, isEmpty } from "lodash";
import { useRouter } from "next/router";

import { MINIMUM_STOP_COUNT } from "@/components/Routes/CreateForm/useLogic";
import useDeferred from "@/hooks/useDeferred";
import useRouterQuery from "@/hooks/useRouterQuery";
import { useCreateLocalStorageRoute } from "@/reactQuery/useLocalStorageRoutes";
import { selectUser, useGetSession } from "@/reactQuery/useSession";
import { getDirections } from "@/services/directions";


export type HandleSubmitData = {
  origin: number,
  destination: number,
  stopTime: number,
  stops: {
    fullText: string,
  }[],
}

export default function useCreateRouteFormApi() {
  const router = useRouter();
  const authUser = useGetSession({ select: selectUser });
  const handleStoreRoute = useCreateLocalStorageRoute();

  const query = useRouterQuery();
  const stops = query.get("stops", []);
  const origin = +(query.get("origin", "0") || 0);
  const destination = +(query.get("destination", "0") || 0);
  const stopTime = +(query.get("stopTime", "0") || 0);

  const getDefaultStops = () => {
    const defStops: ({ fullText: string, mainText?: string } | null)[] = ((isArray(stops) ? stops : [stops]) || []).map(v => ({ fullText: v, mainText: v }));
    defStops.length = Math.max(stops.length, MINIMUM_STOP_COUNT);

    return defStops
      .fill(null, stops.length)
      .map(stop => (stop ?? { fullText: "" }));
  };

  const defaultValues = useDeferred(
    {
      stops: getDefaultStops(),
      origin,
      destination,
      stopTime,
    },
    query.isReady
  );


  const handleSubmit = async (formData: HandleSubmitData) => {
    const { origin, destination } = formData;

    const stops = formData.stops
      .map(({ fullText }) => encodeURIComponent(fullText))
      .map((v, i) => ([
        ...(i === origin ? ["type:origin"] : []),
        ...(i === destination ? ["type:destination"] : []),
        v
      ].join(";")))
      .filter(item => !isEmpty(item))
      .join("|");

    const { routes } = await getDirections({ stops }).catch(err => {
      throw new Error(err.response?.data?.message || err.message || "An error occurred");
    });
    if (routes.length === 0) throw new Error("No routes found");

    const route = routes[0];

    if (!authUser.data?.id) throw new Error("Missing authentication");

    return await handleStoreRoute.mutateAsync({
      userId: authUser.data.id,
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

  return {
    defaultValues: defaultValues.execute,
    onSubmit: handleSubmit,
  };
}