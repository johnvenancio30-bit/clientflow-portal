import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Captions,
  Files,
  MessageSquareText,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Volume2,
} from "lucide-react";
import { ProductPreview } from "@/components/ProductPreview";
import { SiteHeader } from "@/components/SiteHeader";

const features = [
  {
    icon: MessageSquareText,
    number: "01",
    title: "Requests stay actionable",
    copy: "Clients submit clear requests while owners track the decision, status, and next step.",
  },
  {
    icon: Files,
    number: "02",
    title: "Files keep their context",
    copy: "Documents live beside the project, milestone, and people they belong to—not in scattered threads.",
  },
  {
    icon: CircleDollarSign,
    number: "03",
    title: "Billing stays visible",
    copy: "Both sides can see what was sent, what is due, and what has already been paid.",
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero-section">
        <div className="hero-glow" aria-hidden="true" />
        <div className="marketing-shell hero-grid">
          <div className="hero-copy">
            <p className="kicker"><Sparkles size={15} /> CLIENT DELIVERY, WITHOUT THE CHAOS</p>
            <h1>Give every client a clear view of the work.</h1>
            <p className="hero-lede">
              ClientFlow keeps projects, approvals, files, and invoices in one calm workspace—so fewer things get lost between inboxes and meetings.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/demo">
                Try the guided demo <ArrowRight size={17} />
              </Link>
              <Link className="button button-secondary" href="#walkthrough">
                <PlayCircle size={17} /> Watch 70-sec video
              </Link>
            </div>
            <div className="hero-proof" aria-label="Product highlights">
              <span><Check size={15} /> No account needed</span>
              <span><Check size={15} /> Safe demo data</span>
              <span><Check size={15} /> Works on mobile</span>
            </div>
          </div>
          <ProductPreview />
        </div>
      </section>

      <section className="trust-strip" aria-label="Built for service work">
        <div className="marketing-shell trust-inner">
          <span>Designed for</span>
          <strong>Studios</strong>
          <strong>Consultants</strong>
          <strong>Freelancers</strong>
          <strong>Service teams</strong>
        </div>
      </section>

      <section className="section homepage-video-section" id="walkthrough">
        <div className="marketing-shell">
          <div className="section-heading split-heading video-section-heading">
            <div>
              <p className="kicker"><PlayCircle size={15} /> REAL PRODUCT WALKTHROUGH</p>
              <h2>See ClientFlow work before you try it.</h2>
            </div>
            <div className="video-heading-copy">
              <p>Watch the owner complete work, the client submit a request, payment get recorded, and every action appear in the shared history.</p>
              <span><Volume2 size={16} /> Press Play to hear the narrated explanation.</span>
            </div>
          </div>

          <div className="home-video-frame">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/clientflow-walkthrough-poster.png"
              aria-label="Narrated ClientFlow owner and client workflow walkthrough"
            >
              <source src="/clientflow-walkthrough.mp4" type="video/mp4" />
              <track kind="captions" src="/clientflow-walkthrough.vtt" srcLang="en" label="English" default />
              Your browser does not support the video element.
            </video>
          </div>

          <div className="video-proof-grid" aria-label="What the walkthrough demonstrates">
            <span><PlayCircle size={18} /><strong>Real actions</strong><small>Cursor, typing, clicks, and state changes</small></span>
            <span><Volume2 size={18} /><strong>Natural voiceover</strong><small>Clear narration with English captions</small></span>
            <span><Captions size={18} /><strong>English captions</strong><small>Readable with or without audio</small></span>
          </div>
        </div>
      </section>

      <section className="section" id="workflow">
        <div className="marketing-shell">
          <div className="section-heading split-heading">
            <div>
              <p className="kicker">ONE SHARED SOURCE OF TRUTH</p>
              <h2>Simple enough for clients. Structured enough for delivery.</h2>
            </div>
            <p>Every feature answers one practical question: what happened, what needs attention, and who owns the next move?</p>
          </div>
          <div className="feature-grid">
            {features.map(({ icon: Icon, number, title, copy }) => (
              <article className="feature-card" key={title}>
                <div className="feature-card-top"><span>{number}</span><Icon size={21} /></div>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section workflow-section">
        <div className="marketing-shell workflow-grid">
          <div className="workflow-copy">
            <p className="kicker">TWO VIEWS, ONE WORKFLOW</p>
            <h2>The right information for each side.</h2>
            <p>The owner manages delivery. The client sees progress, responds to requests, and finds what they need without learning another complicated tool.</p>
            <ul className="check-list">
              <li><CheckCircle2 size={18} /> Owner dashboard for work and billing</li>
              <li><CheckCircle2 size={18} /> Client portal for updates and approvals</li>
              <li><CheckCircle2 size={18} /> Shared activity history for accountability</li>
            </ul>
          </div>
          <div className="role-stack">
            <article className="role-card owner-card">
              <span className="role-label"><ShieldCheck size={17} /> OWNER VIEW</span>
              <h3>Run the work</h3>
              <p>Create projects, complete milestones, organize files, and manage invoices.</p>
              <Link href="/dashboard">Open owner dashboard <ArrowRight size={16} /></Link>
            </article>
            <article className="role-card client-card">
              <span className="role-label"><MessageSquareText size={17} /> CLIENT VIEW</span>
              <h3>Follow the work</h3>
              <p>Check progress, submit a request, review documents, and confirm payment status.</p>
              <Link href="/portal">Open client portal <ArrowRight size={16} /></Link>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="marketing-shell built-section">
          <div>
            <p className="kicker">PORTFOLIO CASE STUDY</p>
            <h2>Built to demonstrate product thinking—not just polished screens.</h2>
          </div>
          <div className="built-details">
            <p>ClientFlow includes real state changes, validation, persistent demo data, API routes, a Supabase-ready schema, and a safe reset.</p>
            <div className="tech-pills">
              <span>Next.js</span><span>TypeScript</span><span>Supabase-ready</span><span>Vitest</span>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="marketing-shell cta-card">
          <div>
            <p className="kicker">SEE THE SYSTEM WORK</p>
            <h2>Take the shortest route through the demo.</h2>
            <p>No signup. Your changes stay in this browser and can be reset at any time.</p>
          </div>
          <Link className="button button-light" href="/demo">
            Start guided demo <ArrowRight size={17} />
          </Link>
        </div>
      </section>

      <footer className="site-footer">
        <div className="marketing-shell footer-inner">
          <div>
            <strong>ClientFlow</strong>
            <p>A full-stack portfolio project by John Venancio.</p>
          </div>
          <div className="footer-links">
            <Link href="/case-study">Case study</Link>
            <a href="https://github.com/johnvenancio30-bit" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://johnvenancio-portfolio.vercel.app" target="_blank" rel="noreferrer">Portfolio</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
