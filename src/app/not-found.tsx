import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <h1 className="text-3xl font-bold text-ink">Stránka neexistuje</h1>
      <p className="mt-3 text-zinc-600">Odkaz je neplatný nebo byl inzerát mezitím skrytý.</p>
      <Link
        href="/inzeraty"
        className="mt-6 inline-flex min-h-12 items-center justify-center rounded-lg bg-moss px-5 py-3 text-sm font-semibold text-white hover:bg-ink"
      >
        Zpět na inzeráty
      </Link>
    </div>
  );
}
