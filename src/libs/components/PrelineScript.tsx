"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { IStaticMethods } from "preline/preline";

declare global {
  interface Window {
    HSStaticMethods?: IStaticMethods;
  }
}

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    if (!window.HSStaticMethods) {
      import("preline/preline")
        .then(() => {
          window.HSStaticMethods?.autoInit();
        })
        .catch((error) => {
          console.error("Failed to load Preline UI:", error);
        });
    } else {
      window.HSStaticMethods.autoInit();
    }
  }, [path]);

  return null;
}
