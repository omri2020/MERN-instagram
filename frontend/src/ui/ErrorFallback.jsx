function ErrorFallback({ error }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-200 p-12">
      <div className="basis-{80rem} flex-shrink flex-grow-0 rounded-md border bg-gray-100 p-12 [&>h1]:mb-4 [&>p]:mb-8 [&>p]:text-gray-500">
        <h1>Something went wrong</h1>
        <p>{error.message}</p>
      </div>
    </div>
  );
}

export default ErrorFallback;
