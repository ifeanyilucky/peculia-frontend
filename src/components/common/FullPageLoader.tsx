import React from "react";

const FullPageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-500 border-t-transparent"></div>
        <p className="animate-pulse text-sm font-medium text-slate-500">
          Loading Glamyad...
        </p>
      </div>
    </div>
  );
};

export default FullPageLoader;
