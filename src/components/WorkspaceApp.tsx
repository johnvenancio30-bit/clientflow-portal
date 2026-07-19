"use client";

import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FilePlus2,
  Files,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Plus,
  RefreshCcw,
  Send,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Brand } from "@/components/Brand";
import { DEMO_STORAGE_KEY, getFreshSeed } from "@/lib/demo-data";
import { formatCurrency, formatDate, formatShortDate, timeAgo } from "@/lib/format";
import type {
  ActivityRecord,
  InvoiceStatus,
  Role,
  WorkspaceState,
  WorkspaceView,
} from "@/lib/types";
import { invoiceSchema, projectSchema, requestSchema } from "@/lib/validation";

const navigation: Array<{
  view: WorkspaceView;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { view: "overview", label: "Overview", icon: LayoutDashboard },
  { view: "projects", label: "Projects", icon: BriefcaseBusiness },
  { view: "requests", label: "Requests", icon: MessageSquareText },
  { view: "invoices", label: "Invoices", icon: CircleDollarSign },
  { view: "documents", label: "Documents", icon: Files },
  { view: "activity", label: "Activity", icon: Activity },
];

const guidedSteps = [
  { title: "Review delivery", copy: "Start with project progress and the next milestone.", role: "owner" as Role, view: "overview" as WorkspaceView },
  { title: "Complete a milestone", copy: "Open Projects and mark Visual design approval complete.", role: "owner" as Role, view: "projects" as WorkspaceView },
  { title: "Act as the client", copy: "Switch to the client portal and submit a new request.", role: "client" as Role, view: "requests" as WorkspaceView },
  { title: "Confirm the invoice", copy: "Return to the owner view and mark the sent invoice paid.", role: "owner" as Role, view: "invoices" as WorkspaceView },
  { title: "Verify the history", copy: "Every change appears in the shared activity timeline.", role: "owner" as Role, view: "activity" as WorkspaceView },
];

type ModalType = "project" | "request" | "invoice" | "document" | "reset" | null;

function createActivity(
  message: string,
  detail: string,
  actor: string,
  tone: ActivityRecord["tone"] = "gold",
): ActivityRecord {
  return {
    id: `activity-${Date.now()}`,
    message,
    detail,
    actor,
    createdAt: new Date().toISOString(),
    tone,
  };
}

async function notify(event: "request_created" | "milestone_completed" | "invoice_paid", subject: string, message: string) {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        recipient: "maya@northstar.demo",
        subject,
        message,
      }),
    });
  } catch {
    // UI actions remain usable when notifications are unavailable.
  }
}

export function WorkspaceApp({
  initialRole,
  guided = false,
}: {
  initialRole: Role;
  guided?: boolean;
}) {
  const [state, setState] = useState<WorkspaceState>(getFreshSeed);
  const [role, setRole] = useState<Role>(initialRole);
  const [view, setView] = useState<WorkspaceView>("overview");
  const [selectedProjectId, setSelectedProjectId] = useState("project-launch");
  const [modal, setModal] = useState<ModalType>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");
  const [formError, setFormError] = useState("");
  const [guideStep, setGuideStep] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = window.localStorage.getItem(DEMO_STORAGE_KEY);
      if (saved) {
        try {
          setState(JSON.parse(saved) as WorkspaceState);
        } catch {
          window.localStorage.removeItem(DEMO_STORAGE_KEY);
        }
      }
      setReady(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(state));
  }, [ready, state]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleProjects = useMemo(
    () => role === "client" ? state.projects.filter((project) => project.clientId === "client-northstar") : state.projects,
    [role, state.projects],
  );
  const selectedProject = state.projects.find((project) => project.id === selectedProjectId) ?? visibleProjects[0];
  const projectMilestones = state.milestones.filter((milestone) => milestone.projectId === selectedProject?.id);
  const completeMilestones = projectMilestones.filter((milestone) => milestone.complete).length;
  const progress = projectMilestones.length ? Math.round((completeMilestones / projectMilestones.length) * 100) : 0;
  const openRequests = state.requests.filter((request) => request.status !== "Done").length;
  const outstanding = state.invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  function showToast(message: string) {
    setToast(message);
  }

  function changeRole(nextRole: Role) {
    setRole(nextRole);
    setView("overview");
    setMobileOpen(false);
    if (nextRole === "client") setSelectedProjectId("project-launch");
    showToast(nextRole === "owner" ? "Owner dashboard active" : "Client portal active");
  }

  function changeView(nextView: WorkspaceView) {
    setView(nextView);
    setMobileOpen(false);
  }

  function completeMilestone(id: string) {
    const milestone = state.milestones.find((item) => item.id === id);
    if (!milestone || milestone.complete || role !== "owner") return;

    setState((current) => ({
      ...current,
      milestones: current.milestones.map((item) => item.id === id ? { ...item, complete: true } : item),
      activities: [
        createActivity("Milestone completed", milestone.label, "John Venancio", "green"),
        ...current.activities,
      ],
    }));
    showToast(`Completed: ${milestone.label}`);
    void notify("milestone_completed", "Milestone completed", `${milestone.label} is now complete.`);
  }

  function advanceRequest(id: string) {
    if (role !== "owner") return;
    const order = ["New", "In review", "Approved", "Done"] as const;
    const request = state.requests.find((item) => item.id === id);
    if (!request) return;
    const nextStatus = order[Math.min(order.indexOf(request.status) + 1, order.length - 1)];
    setState((current) => ({
      ...current,
      requests: current.requests.map((item) => item.id === id ? { ...item, status: nextStatus } : item),
      activities: [createActivity(`Request moved to ${nextStatus.toLowerCase()}`, request.title, "John Venancio", "blue"), ...current.activities],
    }));
    showToast(`Request is now ${nextStatus.toLowerCase()}`);
  }

  function markInvoicePaid(id: string) {
    if (role !== "owner") return;
    const invoice = state.invoices.find((item) => item.id === id);
    if (!invoice || invoice.status === "Paid") return;
    setState((current) => ({
      ...current,
      invoices: current.invoices.map((item) => item.id === id ? { ...item, status: "Paid" as InvoiceStatus } : item),
      activities: [createActivity("Invoice marked paid", `${invoice.number} · ${formatCurrency(invoice.amount)}`, "John Venancio", "green"), ...current.activities],
    }));
    showToast(`${invoice.number} marked paid`);
    void notify("invoice_paid", "Payment recorded", `${invoice.number} has been marked paid.`);
  }

  function resetDemo() {
    setState(getFreshSeed());
    setRole(initialRole);
    setView("overview");
    setSelectedProjectId("project-launch");
    setGuideStep(0);
    setModal(null);
    window.localStorage.removeItem(DEMO_STORAGE_KEY);
    showToast("Demo restored to its starting state");
  }

  function submitProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = projectSchema.safeParse(Object.fromEntries(form));
    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? "Check the project details.");
      return;
    }
    const id = `project-${Date.now()}`;
    setState((current) => ({
      ...current,
      projects: [
        ...current.projects,
        {
          id,
          clientId: "client-northstar",
          name: result.data.name,
          summary: result.data.summary,
          status: "Planning",
          dueDate: result.data.dueDate,
          budget: result.data.budget,
          accent: "green",
        },
      ],
      milestones: [
        ...current.milestones,
        { id: `milestone-${Date.now()}`, projectId: id, label: "Project kickoff", dueDate: result.data.dueDate, complete: false },
      ],
      activities: [createActivity("Project created", result.data.name, "John Venancio", "gold"), ...current.activities],
    }));
    setSelectedProjectId(id);
    setModal(null);
    setFormError("");
    showToast("Project created");
  }

  function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = requestSchema.safeParse(Object.fromEntries(form));
    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? "Check the request details.");
      return;
    }
    setState((current) => ({
      ...current,
      requests: [
        {
          id: `request-${Date.now()}`,
          projectId: selectedProject?.id ?? "project-launch",
          title: result.data.title,
          detail: result.data.detail,
          status: "New",
          author: role === "client" ? "Maya Chen" : "John Venancio",
          createdAt: new Date().toISOString(),
        },
        ...current.requests,
      ],
      activities: [createActivity("New client request", result.data.title, role === "client" ? "Maya Chen" : "John Venancio", "blue"), ...current.activities],
    }));
    setModal(null);
    setFormError("");
    showToast("Request sent to the project owner");
    void notify("request_created", "New client request", result.data.title);
  }

  function submitInvoice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = invoiceSchema.safeParse(Object.fromEntries(form));
    if (!result.success) {
      setFormError(result.error.issues[0]?.message ?? "Check the invoice details.");
      return;
    }
    const number = `CF-${1013 + state.invoices.length}`;
    setState((current) => ({
      ...current,
      invoices: [
        { id: `invoice-${Date.now()}`, projectId: selectedProject?.id ?? "project-launch", number, amount: result.data.amount, dueDate: result.data.dueDate, status: "Sent" },
        ...current.invoices,
      ],
      activities: [createActivity("Invoice sent", `${number} · ${formatCurrency(result.data.amount)}`, "John Venancio", "gold"), ...current.activities],
    }));
    setModal(null);
    setFormError("");
    showToast(`${number} created and sent`);
  }

  function submitDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const category = String(form.get("category") ?? "").trim();
    if (name.length < 3) {
      setFormError("Add a document name.");
      return;
    }
    setState((current) => ({
      ...current,
      documents: [
        { id: `document-${Date.now()}`, projectId: selectedProject?.id ?? "project-launch", name, category, size: "Demo file", uploadedBy: role === "client" ? "Maya Chen" : "John Venancio", uploadedAt: new Date().toISOString() },
        ...current.documents,
      ],
      activities: [createActivity("Document added", name, role === "client" ? "Maya Chen" : "John Venancio", "gold"), ...current.activities],
    }));
    setModal(null);
    setFormError("");
    showToast("Document added to the project");
  }

  function openModal(nextModal: ModalType) {
    setFormError("");
    setModal(nextModal);
  }

  function openGuidedStep(index: number) {
    const step = guidedSteps[index];
    setGuideStep(index);
    setRole(step.role);
    setView(step.view);
    if (step.role === "client") setSelectedProjectId("project-launch");
  }

  return (
    <div className="workspace-shell">
      <aside className={`workspace-sidebar ${mobileOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand-row">
          <Brand />
          <button className="icon-button sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close navigation"><X size={20} /></button>
        </div>
        <div className="mode-badge"><Sparkles size={14} /> Portfolio demo</div>
        <nav className="workspace-nav" aria-label="Workspace navigation">
          {navigation.map(({ view: itemView, label, icon: Icon }) => (
            <button className={view === itemView ? "active" : ""} key={itemView} onClick={() => changeView(itemView)}>
              <Icon size={18} /><span>{label}</span>
              {itemView === "requests" && openRequests > 0 && <small>{openRequests}</small>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="workspace-person">
            <span>{role === "owner" ? "JV" : "MC"}</span>
            <div><strong>{role === "owner" ? "John Venancio" : "Maya Chen"}</strong><small>{role === "owner" ? "Workspace owner" : "Northstar Studio"}</small></div>
          </div>
          <Link className="back-link" href="/"><ArrowLeft size={16} /> Back to website</Link>
        </div>
      </aside>

      {mobileOpen && <button className="sidebar-scrim" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <div className="workspace-main">
        <header className="workspace-topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open navigation"><Menu size={21} /></button>
            <div>
              <span className="topbar-eyebrow">{role === "owner" ? "OWNER WORKSPACE" : "CLIENT PORTAL"}</span>
              <strong>{role === "owner" ? "Brightline Digital" : "Northstar Studio"}</strong>
            </div>
          </div>
          <div className="topbar-actions">
            <div className="role-switch" aria-label="Switch demo role">
              <button className={role === "owner" ? "active" : ""} onClick={() => changeRole("owner")}><UserRound size={15} /> Owner</button>
              <button className={role === "client" ? "active" : ""} onClick={() => changeRole("client")}><UsersRound size={15} /> Client</button>
            </div>
            <button className="icon-button" onClick={() => openModal("reset")} aria-label="Reset demo" title="Reset demo"><RefreshCcw size={18} /></button>
          </div>
        </header>

        {guided && (
          <section className="guide-bar" aria-label="Guided demo steps">
            <div className="guide-copy">
              <span>GUIDED DEMO · {guideStep + 1} OF {guidedSteps.length}</span>
              <strong>{guidedSteps[guideStep].title}</strong>
              <p>{guidedSteps[guideStep].copy}</p>
            </div>
            <div className="guide-actions">
              <div className="guide-dots" aria-hidden="true">{guidedSteps.map((_, index) => <i className={index === guideStep ? "active" : index < guideStep ? "done" : ""} key={index} />)}</div>
              <button className="button button-guide" onClick={() => openGuidedStep((guideStep + 1) % guidedSteps.length)}>
                {guideStep === guidedSteps.length - 1 ? "Restart tour" : "Next step"} <ArrowRight size={16} />
              </button>
            </div>
          </section>
        )}

        <main className="workspace-content">
          <div className="workspace-page-heading">
            <div>
              <span className="workspace-kicker">{role === "owner" ? "DELIVERY CONTROL" : "YOUR WORKSPACE"}</span>
              <h1>{navigation.find((item) => item.view === view)?.label}</h1>
              <p>{view === "overview" ? (role === "owner" ? "Here is what needs attention across your client work." : "Here is the latest progress on your project.") : pageDescription(view, role)}</p>
            </div>
            <PageAction role={role} view={view} openModal={openModal} />
          </div>

          {view === "overview" && (
            <Overview
              role={role}
              state={state}
              projects={visibleProjects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              progress={progress}
              openRequests={openRequests}
              outstanding={outstanding}
              changeView={changeView}
            />
          )}
          {view === "projects" && (
            <ProjectsView
              role={role}
              state={state}
              projects={visibleProjects}
              selectedProjectId={selectedProjectId}
              setSelectedProjectId={setSelectedProjectId}
              completeMilestone={completeMilestone}
            />
          )}
          {view === "requests" && <RequestsView role={role} state={state} advanceRequest={advanceRequest} />}
          {view === "invoices" && <InvoicesView role={role} state={state} markInvoicePaid={markInvoicePaid} />}
          {view === "documents" && <DocumentsView state={state} />}
          {view === "activity" && <ActivityView activities={state.activities} />}
        </main>
      </div>

      {modal && (
        <Modal title={modalTitle(modal)} onClose={() => setModal(null)}>
          {modal === "project" && <ProjectForm onSubmit={submitProject} error={formError} />}
          {modal === "request" && <RequestForm onSubmit={submitRequest} error={formError} />}
          {modal === "invoice" && <InvoiceForm onSubmit={submitInvoice} error={formError} />}
          {modal === "document" && <DocumentForm onSubmit={submitDocument} error={formError} />}
          {modal === "reset" && (
            <div className="reset-dialog">
              <p>This restores the original projects, requests, documents, invoices, and activity. Nothing outside this browser is affected.</p>
              <div className="modal-actions"><button className="button button-secondary" onClick={() => setModal(null)}>Keep my changes</button><button className="button button-danger" onClick={resetDemo}>Reset demo</button></div>
            </div>
          )}
        </Modal>
      )}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} /> {toast}</div>}
    </div>
  );
}

function pageDescription(view: WorkspaceView, role: Role) {
  const descriptions: Record<WorkspaceView, string> = {
    overview: "",
    projects: role === "owner" ? "Track delivery and complete the next milestone." : "Follow the plan and see what has been completed.",
    requests: role === "owner" ? "Review client feedback and move each request forward." : "Ask for a change without starting another email thread.",
    invoices: role === "owner" ? "Create invoices and keep payment status current." : "See exactly what was billed and what has been paid.",
    documents: "Keep the latest project files organized and easy to find.",
    activity: "A shared record of the decisions and updates that moved the work forward.",
  };
  return descriptions[view];
}

function PageAction({ role, view, openModal }: { role: Role; view: WorkspaceView; openModal: (modal: ModalType) => void }) {
  if (view === "projects" && role === "owner") return <button className="button button-workspace" onClick={() => openModal("project")}><Plus size={17} /> New project</button>;
  if (view === "requests") return <button className="button button-workspace" onClick={() => openModal("request")}><Plus size={17} /> New request</button>;
  if (view === "invoices" && role === "owner") return <button className="button button-workspace" onClick={() => openModal("invoice")}><Plus size={17} /> New invoice</button>;
  if (view === "documents") return <button className="button button-workspace" onClick={() => openModal("document")}><FilePlus2 size={17} /> Add document</button>;
  return null;
}

function Overview({
  role,
  state,
  projects,
  selectedProjectId,
  setSelectedProjectId,
  progress,
  openRequests,
  outstanding,
  changeView,
}: {
  role: Role;
  state: WorkspaceState;
  projects: WorkspaceState["projects"];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  progress: number;
  openRequests: number;
  outstanding: number;
  changeView: (view: WorkspaceView) => void;
}) {
  const project = state.projects.find((item) => item.id === selectedProjectId) ?? projects[0];
  const projectMilestones = state.milestones.filter((item) => item.projectId === project?.id);
  const completed = projectMilestones.filter((item) => item.complete).length;

  return (
    <>
      <section className="metric-grid" aria-label="Workspace summary">
        <article><span>{role === "owner" ? "Active projects" : "Project progress"}</span><strong>{role === "owner" ? projects.filter((item) => item.status !== "Complete").length : `${progress}%`}</strong><small>{role === "owner" ? `${projects.length} total projects` : `${completed} of ${projectMilestones.length} milestones`}</small></article>
        <article><span>Open requests</span><strong>{openRequests}</strong><small>{state.requests.filter((item) => item.status === "New").length} waiting for review</small></article>
        <article><span>{role === "owner" ? "Outstanding" : "Next invoice"}</span><strong>{formatCurrency(outstanding)}</strong><small>{state.invoices.filter((item) => item.status !== "Paid").length} invoice awaiting payment</small></article>
      </section>
      <div className="dashboard-grid">
        <section className="workspace-card project-focus-card">
          <div className="card-heading-row">
            <div><span className="card-eyebrow">CURRENT PROJECT</span><h2>{project?.name}</h2></div>
            <select aria-label="Select current project" value={project?.id} onChange={(event) => setSelectedProjectId(event.target.value)}>
              {projects.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}
            </select>
          </div>
          <p>{project?.summary}</p>
          <div className="large-progress-row"><span>Overall progress</span><strong>{progress}%</strong></div>
          <div className="large-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="focus-meta"><span>Due <strong>{project ? formatDate(project.dueDate) : "—"}</strong></span><span>Status <strong>{project?.status}</strong></span><span>Budget <strong>{project ? formatCurrency(project.budget) : "—"}</strong></span></div>
          <button className="text-action" onClick={() => changeView("projects")}>View project plan <ArrowRight size={16} /></button>
        </section>
        <section className="workspace-card next-up-card">
          <div className="card-heading-row"><div><span className="card-eyebrow">NEXT UP</span><h2>Milestones</h2></div><small>{completed}/{projectMilestones.length}</small></div>
          <div className="compact-list">
            {projectMilestones.slice(0, 4).map((milestone, index) => (
              <div className={milestone.complete ? "compact-item complete" : "compact-item"} key={milestone.id}>
                <span className="compact-marker">{milestone.complete ? <Check size={13} /> : index + 1}</span>
                <div><strong>{milestone.label}</strong><small>{milestone.complete ? "Complete" : `Due ${formatShortDate(milestone.dueDate)}`}</small></div>
              </div>
            ))}
          </div>
        </section>
        <section className="workspace-card activity-card-wide">
          <div className="card-heading-row"><div><span className="card-eyebrow">SHARED HISTORY</span><h2>Recent activity</h2></div><button className="text-action" onClick={() => changeView("activity")}>View all</button></div>
          <ActivityList activities={state.activities.slice(0, 4)} />
        </section>
      </div>
    </>
  );
}

function ProjectsView({ role, state, projects, selectedProjectId, setSelectedProjectId, completeMilestone }: {
  role: Role;
  state: WorkspaceState;
  projects: WorkspaceState["projects"];
  selectedProjectId: string;
  setSelectedProjectId: (id: string) => void;
  completeMilestone: (id: string) => void;
}) {
  const project = state.projects.find((item) => item.id === selectedProjectId) ?? projects[0];
  const milestones = state.milestones.filter((item) => item.projectId === project?.id);
  const complete = milestones.filter((item) => item.complete).length;
  const percent = milestones.length ? Math.round((complete / milestones.length) * 100) : 0;
  return (
    <div className="projects-layout">
      <div className="project-list-column">
        {projects.map((item) => (
          <button className={`project-select-card accent-${item.accent} ${item.id === project?.id ? "active" : ""}`} key={item.id} onClick={() => setSelectedProjectId(item.id)}>
            <span className="status-dot" /><div><strong>{item.name}</strong><small>{item.status} · Due {formatShortDate(item.dueDate)}</small></div><ChevronRight size={18} />
          </button>
        ))}
      </div>
      <section className="workspace-card project-detail-card">
        <div className="card-heading-row"><div><span className="card-eyebrow">PROJECT PLAN</span><h2>{project?.name}</h2></div><span className="status status-progress">{project?.status}</span></div>
        <p>{project?.summary}</p>
        <div className="large-progress-row"><span>{complete} of {milestones.length} milestones complete</span><strong>{percent}%</strong></div>
        <div className="large-progress"><span style={{ width: `${percent}%` }} /></div>
        <div className="milestone-list">
          {milestones.map((milestone, index) => (
            <div className={milestone.complete ? "milestone-row complete" : "milestone-row"} key={milestone.id}>
              <button disabled={role !== "owner" || milestone.complete} onClick={() => completeMilestone(milestone.id)} aria-label={milestone.complete ? `${milestone.label} complete` : `Mark ${milestone.label} complete`}>
                {milestone.complete ? <Check size={15} /> : index + 1}
              </button>
              <div><strong>{milestone.label}</strong><small>{milestone.complete ? "Completed" : `Due ${formatDate(milestone.dueDate)}`}</small></div>
              {!milestone.complete && role === "owner" && <span>Click number to complete</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function RequestsView({ role, state, advanceRequest }: { role: Role; state: WorkspaceState; advanceRequest: (id: string) => void }) {
  return (
    <section className="workspace-card table-card">
      <div className="responsive-table request-table">
        <div className="table-row table-head"><span>Request</span><span>Project</span><span>Status</span><span>Submitted</span><span>Action</span></div>
        {state.requests.map((request) => {
          const project = state.projects.find((item) => item.id === request.projectId);
          return (
            <div className="table-row" key={request.id}>
              <div data-label="Request"><strong>{request.title}</strong><small>{request.detail}</small></div>
              <span data-label="Project">{project?.name}</span>
              <span data-label="Status"><i className={`status status-${request.status.toLowerCase().replace(" ", "-")}`}>{request.status}</i></span>
              <span data-label="Submitted">{formatShortDate(request.createdAt)} · {request.author}</span>
              <span data-label="Action">{role === "owner" && request.status !== "Done" ? <button className="table-action" onClick={() => advanceRequest(request.id)}>Advance <ArrowRight size={14} /></button> : <small>{request.status === "Done" ? "Closed" : "Owner reviewing"}</small>}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function InvoicesView({ role, state, markInvoicePaid }: { role: Role; state: WorkspaceState; markInvoicePaid: (id: string) => void }) {
  return (
    <div className="invoice-grid">
      {state.invoices.map((invoice) => {
        const project = state.projects.find((item) => item.id === invoice.projectId);
        return (
          <article className="workspace-card invoice-card" key={invoice.id}>
            <div className="invoice-top"><span className="invoice-icon"><CircleDollarSign size={20} /></span><i className={`status status-${invoice.status.toLowerCase()}`}>{invoice.status}</i></div>
            <span className="card-eyebrow">{invoice.number}</span><strong className="invoice-amount">{formatCurrency(invoice.amount)}</strong><p>{project?.name}</p>
            <div className="invoice-due"><span>Due date</span><strong>{formatDate(invoice.dueDate)}</strong></div>
            {role === "owner" && invoice.status !== "Paid" ? <button className="button button-card" onClick={() => markInvoicePaid(invoice.id)}><Check size={16} /> Mark as paid</button> : <span className="invoice-note">{invoice.status === "Paid" ? "Payment recorded" : "Awaiting payment"}</span>}
          </article>
        );
      })}
    </div>
  );
}

function DocumentsView({ state }: { state: WorkspaceState }) {
  return (
    <section className="workspace-card table-card">
      <div className="responsive-table document-table">
        <div className="table-row table-head"><span>Document</span><span>Project</span><span>Category</span><span>Added by</span><span>Date</span></div>
        {state.documents.map((document) => {
          const project = state.projects.find((item) => item.id === document.projectId);
          return (
            <div className="table-row" key={document.id}>
              <div data-label="Document" className="document-name"><span><Files size={18} /></span><div><strong>{document.name}</strong><small>{document.size}</small></div></div>
              <span data-label="Project">{project?.name}</span><span data-label="Category">{document.category}</span><span data-label="Added by">{document.uploadedBy}</span><span data-label="Date">{formatShortDate(document.uploadedAt)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ActivityView({ activities }: { activities: ActivityRecord[] }) {
  return <section className="workspace-card activity-page-card"><ActivityList activities={activities} /></section>;
}

function ActivityList({ activities }: { activities: ActivityRecord[] }) {
  return <div className="activity-list">{activities.map((item) => <div className="activity-row" key={item.id}><i className={`tone-${item.tone}`} /><div><strong>{item.message}</strong><small>{item.detail} · {item.actor}</small></div><span>{timeAgo(item.createdAt)}</span></div>)}</div>;
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header"><div><span className="card-eyebrow">CLIENTFLOW DEMO</span><h2 id="modal-title">{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Close dialog"><X size={20} /></button></div>
        {children}
      </section>
    </div>
  );
}

function FormFields({ children, error }: { children: React.ReactNode; error: string }) {
  return <>{children}{error && <p className="form-error" role="alert">{error}</p>}<button className="button button-workspace modal-submit" type="submit"><Send size={16} /> Save and continue</button></>;
}

function ProjectForm({ onSubmit, error }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string }) {
  return <form className="modal-form" onSubmit={onSubmit}><FormFields error={error}><label>Project name<input name="name" placeholder="Brand campaign" required /></label><label>Short summary<textarea name="summary" placeholder="What will this project deliver?" rows={3} required /></label><div className="form-row"><label>Due date<input name="dueDate" type="date" defaultValue="2026-09-15" required /></label><label>Budget (USD)<input name="budget" type="number" defaultValue="3500" min="1" required /></label></div></FormFields></form>;
}

function RequestForm({ onSubmit, error }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string }) {
  return <form className="modal-form" onSubmit={onSubmit}><FormFields error={error}><label>Request title<input name="title" placeholder="Update the homepage headline" required /></label><label>What needs to change?<textarea name="detail" placeholder="Add the context the project owner needs." rows={4} required /></label></FormFields></form>;
}

function InvoiceForm({ onSubmit, error }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string }) {
  return <form className="modal-form" onSubmit={onSubmit}><FormFields error={error}><div className="form-row"><label>Amount (USD)<input name="amount" type="number" defaultValue="1200" min="1" required /></label><label>Due date<input name="dueDate" type="date" defaultValue="2026-08-15" required /></label></div></FormFields></form>;
}

function DocumentForm({ onSubmit, error }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string }) {
  return <form className="modal-form" onSubmit={onSubmit}><FormFields error={error}><label>Document name<input name="name" placeholder="Launch checklist.pdf" required /></label><label>Category<select name="category" defaultValue="Handoff"><option>Content</option><option>Design</option><option>Handoff</option><option>Contract</option></select></label><p className="form-note">This portfolio demo records a file entry without uploading a real file.</p></FormFields></form>;
}

function modalTitle(modal: ModalType) {
  const titles: Record<Exclude<ModalType, null>, string> = { project: "Create a project", request: "Submit a request", invoice: "Create an invoice", document: "Add a document", reset: "Reset the demo?" };
  return modal ? titles[modal] : "";
}
