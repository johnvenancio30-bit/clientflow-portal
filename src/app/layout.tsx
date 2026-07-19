import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-heading",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clientflow-workspace.vercel.app"),
  title: {
    default: "ClientFlow — A calmer client delivery workspace",
    template: "%s | ClientFlow",
  },
  description:
    "A full-stack client portal for projects, approvals, files, invoices, and activity—built as an interactive portfolio case study.",
  applicationName: "ClientFlow",
  keywords: [
    "client portal",
    "project management",
    "full-stack web development",
    "Next.js portfolio",
  ],
  authors: [{ name: "John Venancio", url: "https://johnvenancio-portfolio.vercel.app" }],
  openGraph: {
    title: "ClientFlow — A calmer client delivery workspace",
    description:
      "Keep projects, approvals, documents, and invoices in one client-friendly workspace.",
    url: "https://clientflow-workspace.vercel.app",
    siteName: "ClientFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClientFlow — A calmer client delivery workspace",
    description:
      "An interactive full-stack client portal by John Venancio.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${manrope.variable} ${sourceSans.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
