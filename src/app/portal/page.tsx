import type { Metadata } from "next";
import { WorkspaceApp } from "@/components/WorkspaceApp";

export const metadata: Metadata = {
  title: "Client portal",
  description: "Follow progress, submit requests, find documents, and view invoices in ClientFlow.",
};

export default function PortalPage() {
  return <WorkspaceApp initialRole="client" />;
}
