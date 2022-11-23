
import Button from "../Button";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <h2>Something went wrong</h2>
      <pre>{error.message}</pre>
      <Button
        onClick={resetErrorBoundary}
      >Try again</Button>
    </div>
  )
}
