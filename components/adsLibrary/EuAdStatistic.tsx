// components/adsLibrary/EuAdStatistic.tsx
import React from "react";

interface EuAdStatisticProps {
  data: any; // Replace 'any' with a more specific type if you know the structure of the returned data
  isLoading: boolean;
  error: string | null;
}

export const EuAdStatistic: React.FC<EuAdStatisticProps> = ({
  data,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return <div className="text-center">Loading EU Ad Statistics...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  if (!data) {
    return <div className="text-center">No EU Ad Statistics available.</div>;
  }

  return (
    <div className="rounded-lg bg-white p-4 shadow-md dark:bg-gray-700">
      <h3 className="mb-2 text-lg font-semibold">EU Ad Statistics</h3>
      <pre className="max-h-60 overflow-auto text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};
