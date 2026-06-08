import { redirect } from "next/navigation";
import { Camera, CirclePlus } from "lucide-react";
import { ConfigNotice } from "@/components/ConfigNotice";
import { SubmitButton } from "@/components/SubmitButton";
import { conditionLabels } from "@/lib/format";
import { getCurrentUserProfile } from "@/lib/data";

export default async function AddListingPage() {
  const { user } = await getCurrentUserProfile();

  if (!user) {
    redirect("/prihlaseni?next=/pridat-inzerat");
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-6 md:px-6 md:py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Nový inzerát</p>
      <h1 className="mt-1 text-3xl font-black text-ink">Přidat komponent</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">
        Kategorie je pro MVP nastavená automaticky na Komponenty.
      </p>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      <form
        action="#"
        encType="multipart/form-data"
        className="mt-5 space-y-5 rounded-lg border border-line bg-white p-5 shadow-soft"
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

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="price">
              Cena v Kč
            </label>
            <input id="price" name="price" required inputMode="numeric" min={0} type="number" className="mt-2 px-3 py-3" />
          </div>

          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="condition">
              Stav komponentu
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
          <label className="text-sm font-semibold text-ink" htmlFor="photos">
            Fotografie
          </label>
          <div className="mt-2 rounded-lg border border-dashed border-line bg-fog p-4">
            <label htmlFor="photos" className="flex cursor-pointer items-center gap-3 text-sm font-semibold text-ink">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-moss">
                <Camera className="h-5 w-5" aria-hidden="true" />
              </span>
              Vybrat fotografie z galerie
            </label>
            <input id="photos" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="mt-3" />
            <p className="mt-2 text-xs text-zinc-500">Nahrajte až 8 fotek, první bude hlavní.</p>
          </div>
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
