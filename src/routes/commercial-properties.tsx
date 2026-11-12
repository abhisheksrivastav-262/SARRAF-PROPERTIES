import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/commercial-properties")({ head: () => ({ meta: [{ title: "Commercial Properties | Sarraf Properties" }, { name: "description", content: "Discuss office, retail and commercial property options in Goregaon and Malad, Mumbai." }] }), component: () => <ContentPage page="commercial" /> });
