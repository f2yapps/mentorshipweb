import { redirect } from "next/navigation";

/**
 * Direct messaging is not implemented. Redirect to dashboard so we don't
 * present a non-functional feature. Use dashboard and notifications to stay in touch.
 */
export default function MessagesPage() {
  redirect("/dashboard");
}
