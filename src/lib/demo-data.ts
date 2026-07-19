import type { WorkspaceState } from "@/lib/types";

export const DEMO_STORAGE_KEY = "clientflow-demo-v1";

export const seedWorkspace: WorkspaceState = {
  clients: [
    {
      id: "client-northstar",
      name: "Maya Chen",
      company: "Northstar Studio",
      email: "maya@northstar.demo",
      initials: "MC",
    },
    {
      id: "client-arc",
      name: "Daniel Reyes",
      company: "Arc & Field",
      email: "daniel@arcfield.demo",
      initials: "DR",
    },
  ],
  projects: [
    {
      id: "project-launch",
      clientId: "client-northstar",
      name: "Website launch",
      summary: "Strategy, design, build, and launch for Northstar's new service website.",
      status: "In progress",
      dueDate: "2026-08-14",
      budget: 6800,
      accent: "gold",
    },
    {
      id: "project-portal",
      clientId: "client-arc",
      name: "Partner portal",
      summary: "A secure resource hub for Arc & Field's delivery partners.",
      status: "Review",
      dueDate: "2026-07-31",
      budget: 4200,
      accent: "blue",
    },
  ],
  milestones: [
    {
      id: "milestone-discovery",
      projectId: "project-launch",
      label: "Discovery and content map",
      dueDate: "2026-07-08",
      complete: true,
    },
    {
      id: "milestone-design",
      projectId: "project-launch",
      label: "Visual design approval",
      dueDate: "2026-07-22",
      complete: false,
    },
    {
      id: "milestone-build",
      projectId: "project-launch",
      label: "Responsive build",
      dueDate: "2026-08-05",
      complete: false,
    },
    {
      id: "milestone-launch",
      projectId: "project-launch",
      label: "QA and launch",
      dueDate: "2026-08-14",
      complete: false,
    },
    {
      id: "milestone-portal-review",
      projectId: "project-portal",
      label: "Stakeholder review",
      dueDate: "2026-07-23",
      complete: false,
    },
  ],
  requests: [
    {
      id: "request-headshot",
      projectId: "project-launch",
      title: "Update team headshots",
      detail: "Please replace the three temporary photos on the About page.",
      status: "In review",
      author: "Maya Chen",
      createdAt: "2026-07-18T09:30:00.000Z",
    },
    {
      id: "request-export",
      projectId: "project-portal",
      title: "Add partner CSV export",
      detail: "The operations team needs a filtered list for monthly reporting.",
      status: "Approved",
      author: "Daniel Reyes",
      createdAt: "2026-07-17T05:15:00.000Z",
    },
  ],
  invoices: [
    {
      id: "invoice-1012",
      projectId: "project-launch",
      number: "CF-1012",
      amount: 2040,
      dueDate: "2026-07-28",
      status: "Sent",
    },
    {
      id: "invoice-1008",
      projectId: "project-portal",
      number: "CF-1008",
      amount: 2100,
      dueDate: "2026-07-12",
      status: "Paid",
    },
  ],
  documents: [
    {
      id: "document-content",
      projectId: "project-launch",
      name: "Approved website copy.pdf",
      category: "Content",
      size: "1.8 MB",
      uploadedBy: "Maya Chen",
      uploadedAt: "2026-07-16T07:45:00.000Z",
    },
    {
      id: "document-design",
      projectId: "project-launch",
      name: "Homepage design v3.fig",
      category: "Design",
      size: "4.2 MB",
      uploadedBy: "John Venancio",
      uploadedAt: "2026-07-18T03:20:00.000Z",
    },
    {
      id: "document-guide",
      projectId: "project-portal",
      name: "Portal handoff guide.pdf",
      category: "Handoff",
      size: "920 KB",
      uploadedBy: "John Venancio",
      uploadedAt: "2026-07-15T02:10:00.000Z",
    },
  ],
  activities: [
    {
      id: "activity-design",
      message: "Homepage design v3 shared",
      detail: "Website launch · Design",
      actor: "John Venancio",
      createdAt: "2026-07-18T03:20:00.000Z",
      tone: "gold",
    },
    {
      id: "activity-request",
      message: "Request moved to in review",
      detail: "Update team headshots",
      actor: "John Venancio",
      createdAt: "2026-07-18T09:42:00.000Z",
      tone: "blue",
    },
    {
      id: "activity-copy",
      message: "Approved website copy uploaded",
      detail: "Website launch · Content",
      actor: "Maya Chen",
      createdAt: "2026-07-16T07:45:00.000Z",
      tone: "green",
    },
  ],
};

export function getFreshSeed(): WorkspaceState {
  return JSON.parse(JSON.stringify(seedWorkspace)) as WorkspaceState;
}
