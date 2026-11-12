import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/about")({ head: () => ({ meta: [{ title: "About Sarraf Properties | Mumbai Real Estate" }, { name: "description", content: "Meet Sarraf Properties, your trusted local real estate partner in Goregaon and Malad, Mumbai." }] }), component: () => <ContentPage page="about" /> });
