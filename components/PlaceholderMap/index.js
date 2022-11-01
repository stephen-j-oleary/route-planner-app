
export default function PlaceholderMap({ loader = false, ...props }) {
  return <div {...props}>
    {loader && "Loading..."}
  </div>;
}
