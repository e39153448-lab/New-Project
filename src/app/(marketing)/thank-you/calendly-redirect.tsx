"use client";

import { useEffect } from "react";

export function CalendlyRedirect({ url }: { url: string }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = url;
    }, 4000);
    return () => clearTimeout(timer);
  }, [url]);

  return null;
}
