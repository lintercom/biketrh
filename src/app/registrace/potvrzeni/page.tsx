import Link from "next/link";
import { MailCheck } from "lucide-react";
import { ResendConfirmationForm } from "./ResendConfirmationForm";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function RegistrationConfirmationPage({ searchParams }: PageProps) {
  const { email = "" } = await searchParams;
  const normalizedEmail = email.trim();

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-6 sm:px-5 md:py-8">
      <div className="rounded-lg border border-line bg-white p-5 shadow-soft sm:p-6">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#fff7df] text-moss">
          <MailCheck className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-moss">Potvrzení emailu</p>
        <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">Zkontrolujte email</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          Poslali jsme potvrzovací odkaz{normalizedEmail ? ` na ${normalizedEmail}` : ""}. Otevřete email a potvrďte účet. Potom se
          můžete přihlásit a začít používat BikeTrh.
        </p>
        <div className="mt-4 rounded-lg bg-fog p-4 text-sm leading-6 text-zinc-700">
          Pokud email nevidíte, zkontrolujte složku spam nebo hromadnou poštu. Odkaz může přijít během několika minut.
        </div>

        {normalizedEmail ? <ResendConfirmationForm email={normalizedEmail} /> : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/prihlaseni"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-ink"
          >
            Přejít na přihlášení
          </Link>
          <Link
            href="/registrace"
            className="inline-flex min-h-12 flex-1 items-center justify-center rounded-lg border border-line bg-white px-5 py-3 text-sm font-semibold text-ink hover:bg-fog"
          >
            Změnit email
          </Link>
        </div>
      </div>
    </div>
  );
}
