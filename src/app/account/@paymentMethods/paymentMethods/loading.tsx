import ListSkeleton from "@/components/ui/ListSkeleton";


export default function Loading() {
  return (
    <ListSkeleton disablePadding rowProps={{ divider: true }} />
  );
}