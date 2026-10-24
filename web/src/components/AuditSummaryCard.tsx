import Link from "next/link";
import { StatusTag } from "./StatusTag";

export interface CategorySummary {
  id: string;
  name: string;
  count: number;
  amount: number;
  badgeClass?: string;
}

export interface AuditSummaryData {
  id: string;
  providerName: string;
  invoiceNumber: string;
  date: string;
  totalBilled: number;
  totalPossibleOvercharge: number;
  benchmarkCeiling: number;
  status: string;
  categories: CategorySummary[];
}

interface AuditSummaryCardProps {
  audit: AuditSummaryData;
  onEditClick?: () => void;
  className?: string;
}

export function AuditSummaryCard({
  audit,
  onEditClick,
  className = "",
}: AuditSummaryCardProps) {
  const overchargePercent = (
    (audit.totalPossibleOvercharge / (audit.totalBilled || 1)) *
    100
  ).toFixed(1);

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-[#e5e1dc] overflow-hidden ${className}`}
      role="region"
      aria-label="Audit summary overview"
    >
      {/* Top Meta Bar */}
      <div className="p-4 sm:p-6 bg-[#f0f4fb] border-b border-[#dee3e9] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#4b5563]">
              Diagnostic Audit Report
            </span>
            <span className="text-xs font-mono text-[#6b7280]">
              #{audit.invoiceNumber}
            </span>
            <StatusTag status="HIGH" label="Action Required" size="sm" />
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#171c21] tracking-tight">
            {audit.providerName}
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5">
            Discharge Bill Date: {audit.date} • Reference Database: NPPA &amp; CGHS Central Gazette
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="px-3 py-1 bg-white border border-[#dee3e9] rounded-full text-xs font-semibold text-[#006398] flex items-center gap-1 shadow-2xs">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Statutory Rates Verified
          </span>
        </div>
      </div>

      {/* Grid: Main Financials & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#e5e1dc]">
        {/* Left Column: Totals */}
        <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between gap-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#bd0013] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Total Possible Overcharge Identified
            </span>
            <div className="mt-1 flex items-baseline gap-3 flex-wrap">
              <span className="font-headline text-4xl sm:text-5xl font-bold text-[#bd0013] tabular-nums tracking-tight">
                ₹{audit.totalPossibleOvercharge.toLocaleString("en-IN")}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] text-xs font-bold">
                {overchargePercent}% of invoice
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#4b5563] mt-1 leading-relaxed">
              Charges exceeding NPPA DPCO drug ceilings, unbundled nursing overheads, and rate card guidelines.
            </p>
          </div>

          {/* Sub-breakdown: Billed vs Fair */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#e5e1dc]">
            <div>
              <span className="text-xs uppercase font-semibold text-[#6b7280] block">
                Billed Provisional Total
              </span>
              <span className="font-headline text-2xl font-bold text-[#4b5563] line-through decoration-[#bd0013]/70 decoration-2 tabular-nums">
                ₹{audit.totalBilled.toLocaleString("en-IN")}
              </span>
              <span className="block text-[11px] text-[#6b7280] mt-0.5">
                Hospital discharge draft
              </span>
            </div>
            <div>
              <span className="text-xs uppercase font-semibold text-[#006398] block">
                Verified Fair Reference
              </span>
              <span className="font-headline text-2xl font-bold text-[#006398] tabular-nums">
                ₹{audit.benchmarkCeiling.toLocaleString("en-IN")}
              </span>
              <span className="block text-[11px] text-[#4b5563] mt-0.5">
                NPPA + CGHS Benchmark ceiling
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Categories & Actions */}
        <div className="lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between gap-5 bg-[#faf8f6]">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#4b5563] block mb-3">
              Forensic Category Flags
            </span>
            <div className="flex flex-col gap-2">
              {audit.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#e5e1dc] shadow-2xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        cat.id === "drugs"
                          ? "bg-[#bd0013]"
                          : cat.id === "bundled"
                          ? "bg-[#b26000]"
                          : "bg-[#006398]"
                      }`}
                    />
                    <span className="text-xs font-semibold text-[#171c21] truncate">
                      {cat.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded shrink-0 border ${
                      cat.id === "drugs"
                        ? "bg-[#fee2e2] text-[#991b1b] border-[#fca5a5]"
                        : cat.id === "bundled"
                        ? "bg-[#fffbeb] text-[#92400E] border-[#fcd34d]"
                        : "bg-[#e0f2fe] text-[#006398] border-[#bae6fd]"
                    }`}
                  >
                    {cat.count} Items · ₹{cat.amount.toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/dispute"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-lg bg-[#bd0013] hover:bg-[#a10010] active:bg-[#85000d] text-white font-headline text-lg font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-sm focus-ring"
            >
              <span>Generate Formal Dispute Pack</span>
              <span className="material-symbols-outlined text-[20px]">
                arrow_forward
              </span>
            </Link>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="min-h-[42px] px-3 py-2 rounded-lg bg-white hover:bg-[#f0f4fb] border border-[#e5e1dc] text-[#171c21] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 focus-ring"
              >
                <span className="material-symbols-outlined text-[18px]">
                  download
                </span>
                <span>Summary PDF</span>
              </button>
              <button
                type="button"
                onClick={onEditClick}
                className="min-h-[42px] px-3 py-2 rounded-lg bg-white hover:bg-[#f0f4fb] border border-[#e5e1dc] text-[#171c21] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 focus-ring"
              >
                <span className="material-symbols-outlined text-[18px]">
                  edit_note
                </span>
                <span>Edit Line Items</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
