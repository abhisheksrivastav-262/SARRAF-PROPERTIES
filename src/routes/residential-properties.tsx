import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/residential-properties")({ head: () => ({ meta: [{ title: "Residential Properties | Sarraf Properties" }, { name: "description", content: "Explore residential property possibilities in Goregaon and Malad, Mumbai with Sarraf Properties." }] }), component: () => <ContentPage page="residential" /> });
