export default function ConnectionError() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold text-red-600">Connection Error</h1>
      <p className="text-gray-600 mt-2">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}
