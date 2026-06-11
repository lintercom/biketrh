"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type MessageReadRefreshProps = {
  refreshKey: string;
  enabled?: boolean;
};

export function MessageReadRefresh({ refreshKey, enabled = true }: MessageReadRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const storageKey = `biketrh-read-refresh:${refreshKey}`;

    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    sessionStorage.setItem(storageKey, "1");
    router.refresh();
  }, [enabled, refreshKey, router]);

  return null;
}
