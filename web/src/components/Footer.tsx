import Link from "next/link";

interface FooterProps {
  className?: string;
}

export function Footer({ className = "" }: FooterProps) {
  return (
    <footer
      className={`w-full bg-[#f0f4fb] border-t border-[#e5e1dc] mt-auto shadow-[0_-1px_6px_rgba(0,0,0,0.02)] ${className}`}
      role="contentinfo"
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center gap-6 text-center">
        {/* Mandatory Statutory Notice Capsule */}
        <div className="w-full max-w-3xl px-4 py-3 bg-[#eaeef5] border border-[#dee3e9] rounded-lg">
          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
            <span className="font-bold uppercase tracking-wider text-[#bd0013] mr-1.5 inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
                policy
              </span>
              Statutory Notice:
            </span>
            FairBill flags possible overcharges against publicly gazetted reference prices (NPPA DPCO caps, Jan Aushadhi equivalents, CGHS rate schedules). It does not provide legal advice or accuse healthcare providers of misconduct.
          </p>
        </div>

        {/* Footer Navigation */}
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-[#4b5563]"
          aria-label="Legal & Reference Navigation"
        >
          <Link
            href="/#methodology"
            className="hover:text-[#171c21] transition-colors focus-ring rounded"
          >
            Methodology &amp; Data Sources
          </Link>
          <Link
            href="/#rights"
            className="hover:text-[#171c21] transition-colors focus-ring rounded"
          >
            Patient Rights in India
          </Link>
          <Link
            href="/#ccpa"
            className="hover:text-[#171c21] transition-colors focus-ring rounded"
          >
            Consumer Protection Act (CCPA) Guide
          </Link>
          <Link
            href="/#privacy"
            className="hover:text-[#171c21] transition-colors focus-ring rounded"
          >
            Privacy Policy (100% Ephemeral Processing)
          </Link>
        </nav>

        {/* Copyright & Ephemeral Storage Assurance */}
        <div className="text-xs text-[#6b7280] space-y-1">
          <p>© 2024 FairBill Health Technologies. Autonomous Medical Bill Adjudication.</p>
          <p className="text-[11px] text-[#9ca3af]">
            Zero-retention architecture: Raw bill files and OCR documents are processed in-memory and permanently purged.
          </p>
        </div>
      </div>
    </footer>
  );
}
