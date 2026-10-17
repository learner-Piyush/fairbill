import type { Metadata } from "next";
import { ClerkProvider, SignInButton, Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "FairBill - Medical Bill Auditing",
  description:
    "Audit hospital bills and identify possible overcharges without retaining raw sensitive documents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="antialiased bg-[#0a0f1d] text-slate-100 min-h-screen flex flex-col">
          <header className="border-b border-slate-800/80 bg-[#0d1424]/90 backdrop-blur sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  FB
                </div>
                <span className="font-semibold text-lg tracking-tight text-white">
                  Fair<span className="text-blue-400">Bill</span>
                </span>
              </Link>

              <nav className="flex items-center gap-6">
                <Link
                  href="/"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/audit"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Audit
                </Link>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>

                <div className="pl-2 border-l border-slate-800 flex items-center">
                  <Show when="signed-out">
                    <SignInButton mode="modal">
                      <button className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer">
                        Sign In
                      </button>
                    </SignInButton>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>

          <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500 bg-[#090d18]">
            <p className="max-w-2xl mx-auto px-4">
              FairBill highlights possible overcharges for patient inquiry and negotiation. FairBill does not provide legal advice or accuse healthcare providers of misconduct.
            </p>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
