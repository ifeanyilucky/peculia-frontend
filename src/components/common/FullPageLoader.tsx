import React from "react";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="animate-pulse text-sm font-medium text-muted-foreground">
          Loading Glamyad...
        </p>
      </div>
    </div>
  );
};

export default FullPageLoader;
