import { redirect } from "next/navigation";
import { getOrCreateConversation } from "@/app/actions/messages";

export default async function StartConversationPage({
  searchParams,
}: {
  searchParams: Promise<{ mentor_id?: string; mentee_id?: string }>;
}) {
  const { mentor_id, mentee_id } = await searchParams;
  const conversationId = await getOrCreateConversation(mentor_id, mentee_id);
  redirect(`/messages/${conversationId}`);
}
