import { createFileRoute } from "@tanstack/react-router";
import { ContentPage } from "@/components/site/ContentPage";
export const Route = createFileRoute("/contact")({ head: () => ({ meta: [{ title: "Contact Sarraf Properties | Mumbai" }, { name: "description", content: "Contact Rajan Sarraf at Sarraf Properties by phone, WhatsApp, email or visit the Malad West office." }] }), component: () => <ContentPage page="contact" /> });
