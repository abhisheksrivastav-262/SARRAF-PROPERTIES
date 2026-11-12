import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/buy-property")({ head: () => ({ meta: [{ title: "Buy Property | Sarraf Properties" }, { name: "description", content: "Get personal guidance buying a property in Goregaon, Malad and Mumbai's western suburbs." }] }), component: () => <ContentPage page="buy" /> });
