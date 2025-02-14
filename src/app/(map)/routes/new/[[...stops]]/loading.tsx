import RoutesHeader from "@/components/Routes/Header";
import ListSkeleton from "@/components/ui/ListSkeleton";


export default function Loading() {
  return (
    <div>
      <RoutesHeader
        title="Create a route"
      />

      <ListSkeleton />
    </div>
  );
}