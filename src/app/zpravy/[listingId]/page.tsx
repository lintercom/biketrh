import { notFound, redirect } from "next/navigation";
import { ChatPanel } from "@/components/ChatPanel";
import { MessageReadRefresh } from "@/components/MessageReadRefresh";
import { getConversation, getCurrentUserProfile } from "@/lib/data";

type PageProps = {
  params: Promise<{ listingId: string }>;
  searchParams: Promise<{ chyba?: string; zprava?: string; with?: string }>;
};

export default async function MessagesPage({ params, searchParams }: PageProps) {
  const { listingId } = await params;
  const { chyba, zprava, with: receiverId } = await searchParams;
  const { user } = await getCurrentUserProfile();

  if (!user) {
    redirect(`/prihlaseni?next=/zpravy/${listingId}`);
  }

  const conversation = await getConversation(listingId, receiverId);

  if (!conversation) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1800px] px-4 py-4 sm:px-5 md:px-8 md:py-8">
      <MessageReadRefresh refreshKey={`${conversation.listing.id}:${conversation.receiver?.id ?? "unknown"}:${conversation.messages.at(-1)?.id ?? "empty"}`} />
      {chyba ? <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">{chyba}</div> : null}
      {zprava ? <div className="mb-4 rounded-lg border border-line bg-white p-4 text-sm text-zinc-700">{zprava}</div> : null}

      <div className="overflow-hidden rounded-lg border border-line bg-white shadow-soft">
        <ChatPanel conversation={conversation} currentUserId={user.id} />
      </div>
    </div>
  );
}
