import InvoicesListItem from "@/components/Invoices/ListItem";
import TableSkeleton from "@/components/ui/TableSkeleton";


export default function Loading() {
  return (
    <TableSkeleton size="small" cols={InvoicesListItem.cols} />
  );
}