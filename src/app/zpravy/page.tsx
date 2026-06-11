import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { clsx } from "clsx";
import { Avatar } from "@/components/Avatar";
import { ChatPanel } from "@/components/ChatPanel";
import { EmptyState } from "@/components/EmptyState";
import { MessageReadRefresh } from "@/components/MessageReadRefresh";
import { formatPrice, formatShortDate } from "@/lib/format";
import { getConversation, getCurrentUserProfile, getMessageThreads } from "@/lib/data";
import type { MessageThread } from "@/lib/types";

type PageProps = {
  searchParams: Promise<{ listing?: string; with?: string }>;
};

export default async function MessagesInboxPage({ searchParams }: PageProps) {
  const { user } = await getCurrentUserProfile();
  const { listing, with: receiverId } = await searchParams;

  if (!user) {
    redirect("/prihlaseni?next=/zpravy");
  }

  let threads = await getMessageThreads();
  let selectedThread = threads.find((thread) => thread.listing.id === listing && thread.receiver.id === receiverId) ?? threads[0] ?? null;
  const conversation = selectedThread ? await getConversation(selectedThread.listing.id, selectedThread.receiver.id) : null;
  const hadUnreadSelectedThread = Boolean(selectedThread?.unreadCount);

  if (conversation) {
    threads = await getMessageThreads();
    selectedThread =
      threads.find((thread) => thread.listing.id === conversation.listing.id && thread.receiver.id === conversation.receiver?.id) ??
      selectedThread;
  }

  return (
    <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-5 md:px-8 md:py-8">
      {conversation ? (
        <MessageReadRefresh
          refreshKey={`${conversation.listing.id}:${conversation.receiver?.id ?? "unknown"}:${conversation.messages.at(-1)?.id ?? "empty"}`}
          enabled={hadUnreadSelectedThread}
        />
      ) : null}
      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <div className="grid min-h-[680px] md:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[400px_minmax(0,1fr)]">
          <aside className="min-w-0 border-line md:border-r">
            <div className="flex h-14 items-center border-b border-line px-4">
              <h1 className="text-xl font-bold text-ink">Zprávy</h1>
            </div>

            <div className="max-h-[626px] overflow-y-auto">
              {threads.length > 0 ? (
                threads.map((thread) => (
                  <ThreadLink
                    key={`${thread.listing.id}-${thread.receiver.id}`}
                    thread={thread}
                    active={selectedThread?.listing.id === thread.listing.id && selectedThread.receiver.id === thread.receiver.id}
                  />
                ))
              ) : (
                <div className="p-4">
                  <EmptyState title="Zatím tu nejsou žádné zprávy." text="Konverzace vznikne po dotazu, objednávce nebo nabídce ceny." />
                </div>
              )}
            </div>
          </aside>

          {conversation ? (
            <ChatPanel conversation={conversation} currentUserId={user.id} />
          ) : (
            <div className="flex items-center justify-center p-6 text-center text-base text-zinc-500">
              Vyberte konverzaci ze seznamu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ThreadLink({ thread, active }: { thread: MessageThread; active: boolean }) {
  const image = thread.listing.images[0]?.image_url;
  const href = `/zpravy?listing=${encodeURIComponent(thread.listing.id)}&with=${encodeURIComponent(thread.receiver.id)}`;
  const effectivePrice = thread.acceptedOffer?.proposed_price ?? thread.listing.price;

  return (
    <Link href={href} className={clsx("flex min-w-0 gap-3 border-b border-line p-4 hover:bg-fog", active ? "bg-fog" : "bg-white")}>
      <Avatar profile={thread.receiver} />
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <p className="truncate text-lg font-bold text-ink">{thread.receiver.display_name}</p>
          <p className="shrink-0 text-sm text-zinc-500">{formatShortDate(thread.lastMessage.created_at)}</p>
        </div>
        <p className="mt-0.5 line-clamp-1 text-base text-zinc-600">{thread.lastMessage.price_offer ? "Nabídka ceny" : thread.lastMessage.text}</p>
        <div className="mt-1 flex min-w-0 items-center gap-2">
          {image ? (
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded bg-fog">
              <Image src={image} alt={thread.listing.title} fill sizes="32px" className="object-cover" />
            </span>
          ) : null}
          <span className="min-w-0 truncate text-sm font-semibold text-zinc-700">{thread.listing.title}</span>
          <span className="shrink-0 text-sm font-semibold text-moss">{formatPrice(effectivePrice)}</span>
          {thread.acceptedOffer ? <span className="shrink-0 text-sm text-zinc-500 line-through">{formatPrice(thread.listing.price)}</span> : null}
        </div>
      </div>
      {thread.unreadCount > 0 ? (
        <span className="mt-1 inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
          {thread.unreadCount > 9 ? "9+" : thread.unreadCount}
        </span>
      ) : null}
    </Link>
  );
}
