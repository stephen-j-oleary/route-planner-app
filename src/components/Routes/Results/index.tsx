import RouteResultsFooter from "./Footer";
import LegsList from "./Legs/List";
import Summary from "./Summary";
import { IRoute } from "@/models/Route";


export type RouteResultsProps = {
  route: Omit<IRoute, "_id"> | undefined | null,
  onEdit?: () => void,
  isSaved?: boolean,
  isSaveAllowed: boolean,
};

export default function RouteResults({
  route,
  onEdit,
  isSaved = false,
  isSaveAllowed,
}: RouteResultsProps) {
  return (
    <>
      <Summary route={route} />

      {
        route && (
          <LegsList
            route={route}
            flex={1}
            my={2}
          />
        )
      }

      <RouteResultsFooter
        route={route}
        isSaved={isSaved}
        isSaveAllowed={isSaveAllowed}
        onEdit={onEdit}
      />
    </>
  );
}