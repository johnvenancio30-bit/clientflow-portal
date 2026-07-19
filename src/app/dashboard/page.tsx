import type { Metadata } from "next";
import { WorkspaceApp } from "@/components/WorkspaceApp";

export const metadata: Metadata = {
  title: "Owner dashboard",
  description: "Manage projects, milestones, requests, documents, and invoices in ClientFlow.",
};

export default function DashboardPage() {
  return <WorkspaceApp initialRole="owner" />;
}
