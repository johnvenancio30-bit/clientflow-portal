export type Role = "owner" | "client";

export type WorkspaceView =
  | "overview"
  | "projects"
  | "requests"
  | "invoices"
  | "documents"
  | "activity";

export type ProjectStatus = "Planning" | "In progress" | "Review" | "Complete";
export type RequestStatus = "New" | "In review" | "Approved" | "Done";
export type InvoiceStatus = "Draft" | "Sent" | "Paid";

export interface ClientRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  initials: string;
}

export interface ProjectRecord {
  id: string;
  clientId: string;
  name: string;
  summary: string;
  status: ProjectStatus;
  dueDate: string;
  budget: number;
  accent: "gold" | "blue" | "green";
}

export interface MilestoneRecord {
  id: string;
  projectId: string;
  label: string;
  dueDate: string;
  complete: boolean;
}

export interface RequestRecord {
  id: string;
  projectId: string;
  title: string;
  detail: string;
  status: RequestStatus;
  author: string;
  createdAt: string;
}

export interface InvoiceRecord {
  id: string;
  projectId: string;
  number: string;
  amount: number;
  dueDate: string;
  status: InvoiceStatus;
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  name: string;
  category: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface ActivityRecord {
  id: string;
  message: string;
  detail: string;
  actor: string;
  createdAt: string;
  tone: "gold" | "blue" | "green";
}

export interface WorkspaceState {
  clients: ClientRecord[];
  projects: ProjectRecord[];
  milestones: MilestoneRecord[];
  requests: RequestRecord[];
  invoices: InvoiceRecord[];
  documents: DocumentRecord[];
  activities: ActivityRecord[];
}
