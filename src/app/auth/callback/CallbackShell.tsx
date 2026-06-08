export function CallbackShell({ text }: { text: string }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-md items-center justify-center px-5 py-10 text-center">
      <div className="rounded-lg border border-line bg-white p-6 shadow-soft">
        <h1 className="text-2xl font-black text-ink">Prihlaseni</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-600">{text}</p>
      </div>
    </div>
  );
}
