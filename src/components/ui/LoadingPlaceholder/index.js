
export default function LoadingPlaceholder({
  isLoading = true,
  placeholder: Placeholder,
  children
}) {
  return isLoading
    ? <Placeholder />
    : children;
}
