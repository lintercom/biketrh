import { Server } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export function ConfigNotice() {
  if (isSupabaseConfigured()) {
    return null;
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
      <div className="flex gap-3">
        <Server className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <p>
          Supabase zatím není nastavený. Prohlížení používá ukázková data, akce jako přihlášení,
          vložení inzerátu, objednávky a zprávy začnou fungovat po doplnění hodnot v <code>.env</code>.
        </p>
      </div>
    </div>
  );
}
