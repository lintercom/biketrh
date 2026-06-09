import Link from "next/link";
import { redirect } from "next/navigation";
import { ConfigNotice } from "@/components/ConfigNotice";
import { RegistrationForm } from "./RegistrationForm";
import { getCurrentUserProfile } from "@/lib/data";

type PageProps = {
  searchParams: Promise<{ chyba?: string }>;
};

export default async function SignUpPage({ searchParams }: PageProps) {
  const { user } = await getCurrentUserProfile();
  const { chyba } = await searchParams;

  if (user) {
    redirect("/profil");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-6 sm:px-5 md:py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Registrace</p>
      <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">Vytvořit účet</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">Stačí email, heslo, zobrazované jméno a město.</p>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      {chyba ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}

      <RegistrationForm />

      <p className="mt-5 text-center text-sm text-zinc-600">
        Už máte účet?{" "}
        <Link href="/prihlaseni" className="font-semibold text-moss hover:text-ink">
          Přihlásit se
        </Link>
      </p>
    </div>
  );
}
