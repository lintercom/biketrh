import { Suspense } from "react";
import { AuthCallbackClient } from "./AuthCallbackClient";
import { CallbackShell } from "./CallbackShell";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<CallbackShell text="Dokoncuji prihlaseni..." />}>
      <AuthCallbackClient />
    </Suspense>
  );
}
