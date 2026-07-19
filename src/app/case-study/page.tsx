import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  LayoutDashboard,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Case study",
  description: "How ClientFlow turns scattered client delivery into one clear, accountable workflow.",
};

const decisions = [
  {
    number: "01",
    title: "Separate views, shared truth",
    copy: "Owners need operational controls. Clients need clarity. Both roles read the same project state, activity, and billing records.",
  },
  {
    number: "02",
    title: "Actions create evidence",
    copy: "Completing a milestone, submitting a request, or paying an invoice automatically adds a timestamped activity event.",
  },
  {
    number: "03",
    title: "A safe public demo",
    copy: "Visitors can change real application state without signing in or touching production data, then restore the seed in one click.",
  },
];

export default function CaseStudyPage() {
  return (
    <main>
      <SiteHeader />
      <section className="case-hero">
        <div className="marketing-shell case-hero-grid">
          <div>
            <p className="kicker">FULL-STACK PRODUCT CASE STUDY</p>
            <h1>Client delivery should feel organized on both sides.</h1>
          </div>
          <div className="case-summary">
            <p>ClientFlow is a role-based workspace that brings project progress, client requests, documents, invoices, and decisions into one reliable record.</p>
            <div className="case-meta"><span>ROLE<strong>Product design & development</strong></span><span>STACK<strong>Next.js · TypeScript · Supabase-ready</strong></span><span>STATUS<strong>Interactive live demo</strong></span></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="marketing-shell problem-grid">
          <div><p className="kicker">THE PROBLEM</p><h2>Work is happening. Confidence is not.</h2></div>
          <div className="problem-copy"><p>Small service teams often deliver through a mix of email, chat, cloud folders, spreadsheets, and invoice tools. The client cannot easily answer “what is next?” and the owner spends time reconstructing context.</p><p>The product goal was not to add another complicated project manager. It was to create a focused shared layer between the business and its clients.</p></div>
        </div>
      </section>

      <section className="section case-video-section">
        <div className="marketing-shell">
          <div className="section-heading split-heading"><div><p className="kicker">REAL PRODUCT WALKTHROUGH</p><h2>Watch both sides of the workflow.</h2></div><p>This narrated demo shows real cursor movement, form input, milestone completion, request submission, invoice payment, and the resulting activity history.</p></div>
          <div className="case-video-frame">
            <video controls playsInline preload="metadata" poster="/clientflow-walkthrough-poster.png">
              <source src="/clientflow-walkthrough.mp4" type="video/mp4" />
              <track kind="captions" src="/clientflow-walkthrough.vtt" srcLang="en" label="English" default />
              Your browser does not support the video element.
            </video>
          </div>
        </div>
      </section>

      <section className="section case-dark-section">
        <div className="marketing-shell">
          <div className="section-heading split-heading"><div><p className="kicker">PRODUCT STRATEGY</p><h2>Three decisions shaped the system.</h2></div><p>Each decision reduces client confusion while preserving the controls a service business needs.</p></div>
          <div className="decision-grid">{decisions.map((decision) => <article key={decision.number}><span>{decision.number}</span><h3>{decision.title}</h3><p>{decision.copy}</p></article>)}</div>
        </div>
      </section>

      <section className="section">
        <div className="marketing-shell architecture-grid">
          <div className="architecture-copy">
            <p className="kicker">SYSTEM DESIGN</p>
            <h2>One state model serves every workflow.</h2>
            <p>The demo uses persistent browser state for safe public interaction. The repository also includes API validation and a production-ready Supabase schema with organization-based row security.</p>
            <ul className="check-list">
              <li><CheckCircle2 size={18} /> Zod validation at trust boundaries</li>
              <li><CheckCircle2 size={18} /> Organization-scoped database policies</li>
              <li><CheckCircle2 size={18} /> Resend notification adapter with demo fallback</li>
              <li><CheckCircle2 size={18} /> Deterministic reset for repeatable portfolio demos</li>
            </ul>
          </div>
          <div className="architecture-map" aria-label="ClientFlow system architecture">
            <div className="architecture-roles"><span><LayoutDashboard size={19} /> Owner dashboard</span><span><UsersRound size={19} /> Client portal</span></div>
            <ArrowRight size={20} className="architecture-arrow" />
            <div className="architecture-core"><strong>ClientFlow application</strong><span>Projects · Requests · Files · Invoices · Activity</span></div>
            <ArrowRight size={20} className="architecture-arrow" />
            <div className="architecture-services"><span><Database size={19} /> Supabase</span><span><ShieldCheck size={19} /> Validated API</span></div>
          </div>
        </div>
      </section>

      <section className="section result-section">
        <div className="marketing-shell result-grid">
          <div><p className="kicker">THE RESULT</p><h2>A product visitors can understand—and actually test.</h2></div>
          <div><p>Instead of asking recruiters or clients to imagine the workflow from screenshots, ClientFlow lets them operate both sides of it: complete delivery work, send a client request, record payment, and verify the shared history.</p><div className="result-actions"><Link className="button button-primary" href="/demo">Try the guided demo <ArrowRight size={17} /></Link><a className="button button-secondary" href="https://github.com/johnvenancio30-bit" target="_blank" rel="noreferrer">View GitHub</a></div></div>
        </div>
      </section>
    </main>
  );
}
