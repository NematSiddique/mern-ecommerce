const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative">
        <div className="w-20 h-20 border-gray-200 border-2 rounded-full"></div>
        <div className="w-20 h-20 border-yellow-400 border-t-2 animate-spin rounded-full absolute left-0 top-0"></div>
        <div className="sr-only">Loading</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;