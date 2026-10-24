import type { Metadata } from "next";
import { ClerkProvider, SignInButton, Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "FairBill - Medical Bill Audit & Dispute Protection",
  description:
    "Verify hospital medicines, consumables, and procedure charges against NPPA DPCO drug caps and CGHS standardized schedules.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="light">
        <body className="antialiased bg-[#f7f9ff] text-[#171c21] min-h-screen flex flex-col font-body selection:bg-[#ffdad6] selection:text-[#410002]">
          {/* Top Application Header */}
          <header className="sticky top-0 z-50 bg-[#f7f9ff]/95 backdrop-blur-md border-b border-[#e5e1dc] shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
            <div className="h-16 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
              {/* Brand Logo */}
              <Link
                href="/"
                className="flex items-center gap-2.5 group focus-ring rounded-lg p-1"
                aria-label="FairBill Home"
              >
                <div className="w-8 h-8 rounded-lg bg-[#bd0013] flex items-center justify-center font-bold text-white shadow-xs group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">
                    health_and_safety
                  </span>
                </div>
                <span className="font-headline text-xl sm:text-2xl font-bold tracking-tight uppercase text-[#171c21]">
                  Fair<span className="text-[#bd0013]">Bill</span>
                </span>
              </Link>

              {/* Navigation Links */}
              <nav
                className="hidden md:flex items-center gap-1.5 p-1 bg-[#eaeef5] rounded-lg border border-[#dee3e9]"
                aria-label="Main Navigation"
              >
                <Link
                  href="/"
                  className="px-3 py-1.5 rounded-md text-xs font-bold transition-colors hover:text-[#171c21] text-[#4b5563] focus-ring"
                >
                  New Audit
                </Link>
                <Link
                  href="/audit"
                  className="px-3 py-1.5 rounded-md text-xs font-bold transition-colors hover:text-[#171c21] text-[#4b5563] focus-ring"
                >
                  Audit Report
                </Link>
                <Link
                  href="/dispute"
                  className="px-3 py-1.5 rounded-md text-xs font-bold transition-colors hover:text-[#171c21] text-[#4b5563] focus-ring"
                >
                  Dispute Pack
                </Link>
                <Link
                  href="/dashboard"
                  className="px-3 py-1.5 rounded-md text-xs font-bold transition-colors hover:text-[#171c21] text-[#4b5563] focus-ring"
                >
                  Past Audits
                </Link>
              </nav>

              {/* Header Right Actions */}
              <div className="flex items-center gap-3 shrink-0">
                {/* Regulatory pill */}
                <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 bg-[#eaeef5] border border-[#dee3e9] rounded-full text-[#4b5563]">
                  <span className="w-2 h-2 rounded-full bg-[#006398] shrink-0" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    NPPA &amp; CGHS Rates Updated
                  </span>
                </div>

                {/* Helpline */}
                <a
                  href="tel:1800FAIRBILL"
                  className="hidden sm:flex items-center gap-1 px-3 py-1 bg-[#e4e8ef] hover:bg-[#dee3e9] text-[#171c21] rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors border border-[#dee3e9] focus-ring"
                >
                  <span className="material-symbols-outlined text-[#bd0013] text-[16px]">
                    call
                  </span>
                  <span>1800-FAIR-BILL</span>
                </a>

                {/* Clerk Auth Integration */}
                <div className="pl-1 flex items-center">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#bd0013] hover:bg-[#a10010] active:bg-[#85000d] text-white transition-colors cursor-pointer shadow-2xs focus-ring">
                        Sign In
                      </button>
                    </SignInButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </div>
            </div>
          </header>

          {/* Main Page Body */}
          <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {children}
          </main>

          {/* Reusable Statutory Footer */}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
