import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/Brand";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="marketing-shell header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/#workflow">How it works</Link>
          <Link href="/case-study">Case study</Link>
          <a
            href="https://johnvenancio-portfolio.vercel.app"
            target="_blank"
            rel="noreferrer"
          >
            Developer <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </nav>
        <Link className="button button-small button-primary" href="/demo">
          Try the demo
        </Link>
      </div>
    </header>
  );
}
