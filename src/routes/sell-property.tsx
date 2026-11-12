import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/sell-property")({ head: () => ({ meta: [{ title: "Sell Property | Sarraf Properties" }, { name: "description", content: "Speak with Sarraf Properties about selling a residential or commercial property in Mumbai." }] }), component: () => <ContentPage page="sell" /> });
