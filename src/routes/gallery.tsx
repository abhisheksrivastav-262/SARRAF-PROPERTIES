import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/gallery")({ head: () => ({ meta: [{ title: "Property Gallery | Sarraf Properties" }, { name: "description", content: "Browse a visual gallery of residential, commercial and interior property styles in Mumbai." }] }), component: () => <ContentPage page="gallery" /> });
