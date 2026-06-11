import { redirect } from "next/navigation";
import { CirclePlus } from "lucide-react";
import { CategoryFields } from "@/components/CategoryFields";
import { ConfigNotice } from "@/components/ConfigNotice";
import { PhotoUploadRows } from "@/components/PhotoUploadRows";
import { SubmitButton } from "@/components/SubmitButton";
import { createListingAction } from "@/app/actions";
import { conditionLabels } from "@/lib/format";
import { getCurrentUserProfile } from "@/lib/data";

type PageProps = {
  searchParams: Promise<{ chyba?: string }>;
};

export default async function AddListingPage({ searchParams }: PageProps) {
  const { user } = await getCurrentUserProfile();
  const { chyba } = await searchParams;

  if (!user) {
    redirect("/prihlaseni?next=/pridat-inzerat");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-5 sm:px-5 md:px-6 md:py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Nový inzerát</p>
      <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">Přidat inzerát</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">Vyberte hlavní kategorii a odpovídající podkategorii.</p>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      {chyba ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}

      <form
        action={createListingAction}
        className="mt-5 space-y-5 rounded-lg border border-line bg-white p-4 shadow-soft sm:p-5"
      >
        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="title">
            Název
          </label>
          <input id="title" name="title" required minLength={3} maxLength={120} className="mt-2 px-3 py-3" />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="description">
            Popis
          </label>
          <textarea id="description" name="description" required minLength={10} rows={6} className="mt-2 px-3 py-3" />
        </div>

        <CategoryFields />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="price">
              Cena v Kč
            </label>
            <input id="price" name="price" required inputMode="numeric" min={0} type="number" className="mt-2 px-3 py-3" />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="condition">
              Stav položky
            </label>
            <select id="condition" name="condition" required defaultValue="good" className="mt-2 px-3 py-3">
              {Object.entries(conditionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-ink" htmlFor="location">
            Lokalita
          </label>
          <input id="location" name="location" required minLength={2} maxLength={120} className="mt-2 px-3 py-3" />
        </div>

        <div>
          <label className="text-sm font-semibold text-ink">Fotografie</label>
          <PhotoUploadRows label="Vybrat fotografie z galerie" />
        </div>

        <SubmitButton pendingText="Vkládám inzerát...">
          <span className="inline-flex items-center gap-2">
            <CirclePlus className="h-4 w-4" aria-hidden="true" />
            Zveřejnit inzerát
          </span>
        </SubmitButton>
      </form>
    </div>
  );
}
