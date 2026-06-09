import { notFound, redirect } from "next/navigation";
import { Send } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { SubmitButton } from "@/components/SubmitButton";
import { sendMessageAction } from "@/app/actions";
import { formatShortDate } from "@/lib/format";
import { getConversation, getCurrentUserProfile } from "@/lib/data";

type PageProps = {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<{ chyba?: string }>;
};

export default async function MessagesPage({ params, searchParams }: PageProps) {
  const { listingId } = await params;
  const { chyba } = await searchParams;
  const { user } = await getCurrentUserProfile();

  if (!user) {
    redirect(`/prihlaseni?next=/zpravy/${listingId}`);
  }

  const conversation = await getConversation(listingId);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-3xl flex-col px-4 py-4 sm:px-5 md:min-h-[calc(100vh-4rem)] md:px-6 md:py-8">
      <header className="rounded-lg border border-line bg-white p-4 shadow-soft">
        <div className="flex min-w-0 items-center gap-3">
          {conversation.receiver ? <Avatar profile={conversation.receiver} /> : null}
          <div className="min-w-0">
            <h1 className="truncate text-lg font-black text-ink sm:text-xl">{conversation.listing.title}</h1>
            <p className="truncate text-sm text-zinc-600">
              {conversation.receiver ? `Konverzace s ${conversation.receiver.display_name}` : "Konverzace k inzerátu"}
            </p>
          </div>
        </div>
      </header>

      {chyba ? <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}

      <section className="mt-4 flex-1 space-y-3 rounded-lg border border-line bg-white p-3 shadow-soft sm:p-4">
        {conversation.messages.length > 0 ? (
          conversation.messages.map((message) => {
            const mine = message.sender_id === user.id;
            return (
              <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div
                  className={
                    mine
                      ? "max-w-[88%] rounded-lg bg-moss px-4 py-3 text-white sm:max-w-[82%]"
                      : "max-w-[88%] rounded-lg bg-fog px-4 py-3 text-ink sm:max-w-[82%]"
                  }
                >
                  <p className="whitespace-pre-line break-words text-sm leading-6">{message.text}</p>
                  <p className={mine ? "mt-1 text-xs text-white/75" : "mt-1 text-xs text-zinc-500"}>
                    {formatShortDate(message.created_at)}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-48 items-center justify-center text-center text-sm text-zinc-500">
            Zatím tu nejsou žádné zprávy.
          </div>
        )}
      </section>

      {conversation.receiver ? (
        <form action={sendMessageAction} className="mt-4 rounded-lg border border-line bg-white p-3 shadow-soft">
          <input type="hidden" name="listing_id" value={conversation.listing.id} />
          <input type="hidden" name="receiver_id" value={conversation.receiver.id} />
          <label className="sr-only" htmlFor="text">
            Zpráva
          </label>
          <textarea id="text" name="text" rows={3} required maxLength={2000} className="px-3 py-3 text-sm" />
          <div className="mt-3">
            <SubmitButton pendingText="Odesílám...">
              <span className="inline-flex items-center gap-2">
                <Send className="h-4 w-4" aria-hidden="true" />
                Odeslat zprávu
              </span>
            </SubmitButton>
          </div>
        </form>
      ) : (
        <p className="mt-4 rounded-lg border border-line bg-white p-4 text-sm text-zinc-600">
          Zprávy se otevřou po vytvoření objednávky.
        </p>
      )}
    </div>
  );
}
