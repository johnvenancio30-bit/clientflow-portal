import type { Metadata } from "next";
import { WorkspaceApp } from "@/components/WorkspaceApp";

export const metadata: Metadata = {
  title: "Guided demo",
  description: "Try the complete ClientFlow owner and client workflow without creating an account.",
};

export default function DemoPage() {
  return <WorkspaceApp initialRole="owner" guided />;
}
