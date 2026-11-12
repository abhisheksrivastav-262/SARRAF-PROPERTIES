import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/services")({ head: () => ({ meta: [{ title: "Real Estate Services | Sarraf Properties" }, { name: "description", content: "Residential and commercial property consultation, buying assistance, selling assistance and investment guidance." }] }), component: () => <ContentPage page="services" /> });
