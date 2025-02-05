import "client-only";

import { usePathname } from "next/navigation";
import { useCallback } from "react";

import { TPage } from "./pages";


export function useIsPageActive() {
  const pathname = usePathname();

  const isPageActive = useCallback(
    (page: TPage) => !!(
      pathname === page.path
        || page.pages?.some(isPageActive)
    ),
    [pathname]
  );

  return isPageActive;
}