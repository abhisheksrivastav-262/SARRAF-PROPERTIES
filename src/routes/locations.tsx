import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/locations")({ head: () => ({ meta: [{ title: "Locations in Goregaon & Malad | Sarraf Properties" }, { name: "description", content: "Explore Sarraf Properties service locations in Goregaon and Malad, Mumbai. Find our Malad West office." }] }), component: () => <ContentPage page="locations" /> });
