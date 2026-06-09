import Link from "next/link";
import { redirect } from "next/navigation";
import { ConfigNotice } from "@/components/ConfigNotice";
import { LoginForm } from "./LoginForm";
import { getCurrentUserProfile } from "@/lib/data";

type PageProps = {
  searchParams: Promise<{ chyba?: string; zprava?: string; next?: string; email?: string }>;
};

export default async function SignInPage({ searchParams }: PageProps) {
  const { user } = await getCurrentUserProfile();
  const { chyba, zprava, next = "/profil", email = "" } = await searchParams;

  if (user) {
    redirect(next.startsWith("/") && !next.startsWith("//") ? next : "/profil");
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-6 sm:px-5 md:py-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-moss">Přihlášení</p>
      <h1 className="mt-1 text-2xl font-black text-ink sm:text-3xl">Vítejte zpět</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-600">Přihlaste se a pokračujte v obchodování u konkrétních inzerátů.</p>

      <div className="mt-5">
        <ConfigNotice />
      </div>

      {chyba ? <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}
      {zprava ? (
        <div className="mt-5 rounded-lg border border-line bg-white p-4 text-sm leading-6 text-zinc-700">
          {zprava}
          {email ? (
            <div className="mt-3">
              <Link href={`/registrace/potvrzeni?email=${encodeURIComponent(email)}`} className="font-semibold text-moss hover:text-ink">
                Poslat potvrzovací email znovu
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      <LoginForm next={next} email={email} />

      <p className="mt-5 text-center text-sm text-zinc-600">
        Nemáte účet?{" "}
        <Link href="/registrace" className="font-semibold text-moss hover:text-ink">
          Zaregistrovat se
        </Link>
      </p>
    </div>
  );
}
