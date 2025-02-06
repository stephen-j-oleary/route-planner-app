import "client-only";

import { usePathname } from "next/navigation";
import { useCallback } from "react";


export function useIsPageActive() {
  const pathname = usePathname();

  const isPageActive = useCallback(
    (path: string) => (pathname === path),
    [pathname]
  );

  return isPageActive;
}