// hooks/useFilterReset.ts

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const useFilterReset = (filterParams: string[]) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    let changed = false;

    filterParams.forEach((param) => {
      if (params.has(param)) {
        params.delete(param);
        changed = true;
      }
    });

    if (changed) {
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [router, searchParams, filterParams]);

  return { clearFilters };
};
