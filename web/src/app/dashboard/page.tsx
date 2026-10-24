"use client";

import { useState } from "react";
import Link from "next/link";
import sampleAuditFixture from "@/fixtures/sample-audit.json";
import { StatusTag } from "@/components/StatusTag";

interface PastAuditItem {
  id: string;
  providerName: string;
  invoiceNumber: string;
  date: string;
  type: string;
  pages: number;
  totalBilled: number;
  totalPossibleOvercharge: number;
  recoveredAmount?: number;
  status: "DISPUTED" | "SETTLED" | "PENDING";
  statusLabel: string;
  flagLevel: string;
  actionNeeded: boolean;
}

export default function DashboardPage() {
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const pastAudits: PastAuditItem[] = sampleAuditFixture.pastAudits as PastAuditItem[];

  const filteredAudits = pastAudits.filter((audit) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "disputed"
        ? audit.status === "DISPUTED"
        : filter === "settled"
        ? audit.status === "SETTLED"
        : filter === "pending"
        ? audit.status === "PENDING"
        : true;

    const matchesSearch =
      search === ""
        ? true
        : audit.providerName.toLowerCase().includes(search.toLowerCase()) ||
          audit.invoiceNumber.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalAuditedBilled = pastAudits.reduce((acc, a) => acc + a.totalBilled, 0);
  const totalPossibleOvercharges = pastAudits.reduce(
    (acc, a) => acc + a.totalPossibleOvercharge,
    0
  );
  const totalRecovered = pastAudits.reduce(
    (acc, a) => acc + (a.recoveredAmount || 0),
    0
  );

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Page Title & New Audit CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e1dc] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#bd0013]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#4b5563]">
              Private Clinical Audit Vault
            </span>
          </div>
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-[#171c21] tracking-tight">
            Historical Audit Registry
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5">
            Structured records of reviewed bills, disputed items, and hospital waiver outcomes.
          </p>
        </div>

        <Link
          href="/"
          className="min-h-[44px] px-4 py-2 bg-[#bd0013] hover:bg-[#a10010] active:bg-[#85000d] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all self-start sm:self-center focus-ring"
        >
          <span className="material-symbols-outlined text-[18px]">
            add_circle
          </span>
          <span>Audit New Bill</span>
        </Link>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#e5e1dc] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#4b5563]">
              Total Billed Audited
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f0f4fb] flex items-center justify-center text-[#006398]">
              <span className="material-symbols-outlined text-[18px]">
                receipt_long
              </span>
            </div>
          </div>
          <div>
            <div className="font-headline text-3xl sm:text-4xl font-bold text-[#171c21] tabular-nums">
              ₹{totalAuditedBilled.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-[#4b5563] mt-1">
              3 Hospital Admissions evaluated
            </div>
          </div>
          <div className="text-[11px] font-bold text-[#006398] pt-2 border-t border-[#f0f4fb]">
            100% In-Memory Parsing Verified
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#fca5a5] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#bd0013]">
              Possible Overcharges Flagged
            </span>
            <div className="w-8 h-8 rounded-full bg-[#fee2e2] flex items-center justify-center text-[#bd0013]">
              <span className="material-symbols-outlined text-[18px]">
                warning
              </span>
            </div>
          </div>
          <div>
            <div className="font-headline text-3xl sm:text-4xl font-bold text-[#bd0013] tabular-nums">
              ₹{totalPossibleOvercharges.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-[#4b5563] mt-1">
              21.2% average possible markup
            </div>
          </div>
          <div className="text-[11px] font-bold text-[#bd0013] pt-2 border-t border-[#fee2e2]">
            NPPA Gazette &amp; Jan Aushadhi Caps
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-xl p-5 shadow-2xs border border-[#bbf7d0] flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold tracking-wider text-[#166534]">
              Waived &amp; Recovered
            </span>
            <div className="w-8 h-8 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[#166534]">
              <span className="material-symbols-outlined text-[18px]">
                price_check
              </span>
            </div>
          </div>
          <div>
            <div className="font-headline text-3xl sm:text-4xl font-bold text-[#166534] tabular-nums">
              ₹{totalRecovered.toLocaleString("en-IN")}
            </div>
            <div className="text-xs text-[#4b5563] mt-1">
              Successfully adjusted at discharge
            </div>
          </div>
          <div className="text-[11px] font-bold text-[#166534] pt-2 border-t border-[#bbf7d0]">
            Resolution rate: 74.2%
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-2xs border border-[#e5e1dc] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[18px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by hospital name, or invoice number..."
            className="w-full pl-9 pr-3 py-2 bg-[#f0f4fb] border border-[#cbd5e1] rounded-lg text-xs sm:text-sm font-medium text-[#171c21] focus-ring focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus-ring shrink-0 ${
              filter === "all"
                ? "bg-[#171c21] text-white"
                : "bg-[#f0f4fb] text-[#4b5563] hover:text-[#171c21]"
            }`}
          >
            All ({pastAudits.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("disputed")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus-ring shrink-0 ${
              filter === "disputed"
                ? "bg-[#bd0013] text-white"
                : "bg-[#f0f4fb] text-[#4b5563] hover:text-[#171c21]"
            }`}
          >
            Disputed ({pastAudits.filter((a) => a.status === "DISPUTED").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("settled")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus-ring shrink-0 ${
              filter === "settled"
                ? "bg-[#166534] text-white"
                : "bg-[#f0f4fb] text-[#4b5563] hover:text-[#171c21]"
            }`}
          >
            Settled ({pastAudits.filter((a) => a.status === "SETTLED").length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all focus-ring shrink-0 ${
              filter === "pending"
                ? "bg-[#006398] text-white"
                : "bg-[#f0f4fb] text-[#4b5563] hover:text-[#171c21]"
            }`}
          >
            Pending ({pastAudits.filter((a) => a.status === "PENDING").length})
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="flex flex-col gap-4">
        {filteredAudits.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-[#e5e1dc] text-[#6b7280] text-sm">
            No audits match your filter criteria.
          </div>
        ) : (
          filteredAudits.map((audit) => (
            <div
              key={audit.id}
              className="bg-white rounded-xl shadow-2xs border border-[#e5e1dc] overflow-hidden flex flex-col md:flex-row transition-all hover:border-[#cbd5e1]"
            >
              {/* Left Color Indicator Strip */}
              <div
                className={`w-full md:w-2 ${
                  audit.status === "DISPUTED"
                    ? "bg-[#bd0013]"
                    : audit.status === "SETTLED"
                    ? "bg-[#166534]"
                    : "bg-[#006398]"
                }`}
              />

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <StatusTag
                        status={audit.status}
                        label={audit.statusLabel}
                        size="sm"
                      />
                      <span className="text-xs font-mono text-[#6b7280]">
                        {audit.invoiceNumber}
                      </span>
                    </div>
                    <h2 className="font-headline text-2xl font-bold text-[#171c21]">
                      {audit.providerName}
                    </h2>
                    <p className="text-xs text-[#4b5563] mt-0.5">
                      {audit.date} • {audit.type} ({audit.pages} pages)
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-xs uppercase font-bold text-[#6b7280] block">
                      Billed Amount
                    </span>
                    <span className="font-headline text-2xl font-bold text-[#171c21] tabular-nums">
                      ₹{audit.totalBilled.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                {/* Submetrics & CTAs */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#f0f4fb]">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div>
                      <span className="text-[11px] uppercase font-bold text-[#bd0013] block">
                        Possible Overcharge
                      </span>
                      <span className="font-headline text-lg font-bold text-[#bd0013] tabular-nums">
                        ₹{audit.totalPossibleOvercharge.toLocaleString("en-IN")}
                      </span>
                    </div>

                    {audit.recoveredAmount && (
                      <div>
                        <span className="text-[11px] uppercase font-bold text-[#166534] block">
                          Adjusted / Waived
                        </span>
                        <span className="font-headline text-lg font-bold text-[#166534] tabular-nums">
                          ₹{audit.recoveredAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href="/audit"
                      className="px-3.5 py-1.5 rounded-lg bg-[#f0f4fb] hover:bg-[#eaeef5] text-[#171c21] text-xs font-bold border border-[#dee3e9] transition-colors focus-ring"
                    >
                      View Breakdown
                    </Link>
                    <Link
                      href="/dispute"
                      className="px-3.5 py-1.5 rounded-lg bg-[#bd0013] hover:bg-[#a10010] text-white text-xs font-bold shadow-2xs transition-colors focus-ring"
                    >
                      Dispute Pack
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
