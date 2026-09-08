import { redirect } from "next/navigation";

/** Protótipo de painel do site anterior. O painel real é `/painel`. */
export default function TesteDashboardPage() {
  redirect("/painel");
}
