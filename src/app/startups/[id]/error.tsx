'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Startup page rendering error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
      <span className="material-symbols-outlined text-6xl text-red-500">error</span>
      <h2 className="text-2xl font-bold text-on-surface">Something went wrong!</h2>
      <p className="text-on-surface-variant text-sm bg-red-100 text-red-800 p-4 rounded-lg max-w-lg overflow-auto">
        {error.message || "An unknown error occurred while rendering this startup's details."}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-brand-orange text-white rounded-lg font-bold"
      >
        Try again
      </button>
    </div>
  );
}
