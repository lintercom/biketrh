"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { CallbackShell } from "./CallbackShell";

export function AuthCallbackClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Dokoncuji prihlaseni...");

  useEffect(() => {
    let cancelled = false;

    async function finishAuth() {
      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        setMessage("Supabase neni nakonfigurovany. Doplnte verejne promenne prostredi.");
        return;
      }

      const code = searchParams.get("code");
      const next = searchParams.get("next");
      const target = next?.startsWith("/") && !next.startsWith("//") ? next : "/profil";

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (error && !cancelled) {
          setMessage("Prihlaseni se nepovedlo. Zkuste odkaz otevrit znovu.");
          return;
        }
      }

      if (!cancelled) {
        router.replace(target);
      }
    }

    void finishAuth();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  return <CallbackShell text={message} />;
}
