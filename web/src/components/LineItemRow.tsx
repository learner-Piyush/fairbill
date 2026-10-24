"use client";

import { useState } from "react";
import { StatusTag } from "./StatusTag";

export interface AuditItemData {
  id: string;
  cptCode?: string;
  description: string;
  quantity?: number;
  unitBilled?: number;
  unitBenchmark?: number;
  billedAmount: number;
  benchmarkAmount?: number;
  possibleOvercharge?: number;
  status: "HIGH" | "DUPLICATE" | "REVIEW" | "FAIR" | string;
  statusLabel?: string;
  source?: string;
  clause?: string;
  explanation?: string;
}

interface LineItemRowProps {
  item: AuditItemData;
  defaultExpanded?: boolean;
  onEditClick?: (item: AuditItemData) => void;
  className?: string;
}

export function LineItemRow({
  item,
  defaultExpanded = false,
  onEditClick,
  className = "",
}: LineItemRowProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const isOvercharge = (item.possibleOvercharge ?? 0) > 0;
  const normalizedStatus = item.status.toUpperCase();

  const accentColor =
    normalizedStatus === "HIGH"
      ? "bg-[#bd0013]"
      : normalizedStatus === "DUPLICATE"
      ? "bg-[#b26000]"
      : normalizedStatus === "REVIEW"
      ? "bg-[#006398]"
      : "bg-[#166534]";

  return (
    <div
      className={`rounded-xl bg-white border border-[#e5e1dc] shadow-2xs overflow-hidden transition-all duration-200 ${className}`}
      data-testid={`audit-row-${item.id}`}
    >
      {/* Clickable Row Header */}
      <div
        onClick={toggleExpand}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleExpand();
          }
        }}
        tabIndex={0}
        role="button"
        aria-expanded={isExpanded}
        aria-label={`Audit line item: ${item.description}`}
        className="p-4 sm:p-5 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#f0f4fb]/50 transition-colors focus-ring"
      >
        <div className="flex items-start gap-3 min-w-0">
          {/* Accent vertical pill */}
          <div
            className={`w-1.5 h-12 rounded-full shrink-0 ${accentColor}`}
            aria-hidden="true"
          />

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm sm:text-base text-[#171c21]">
                {item.description}
              </span>
              <StatusTag
                status={item.status}
                label={item.statusLabel}
                size="sm"
              />
            </div>

            <div className="flex items-center gap-2 text-xs text-[#4b5563] mt-1 flex-wrap">
              {item.unitBilled ? (
                <span>
                  Billed: ₹{item.unitBilled.toLocaleString("en-IN")}
                  {item.quantity ? ` × ${item.quantity}` : ""} (₹
                  {item.billedAmount.toLocaleString("en-IN")} total)
                </span>
              ) : (
                <span>Billed: ₹{item.billedAmount.toLocaleString("en-IN")}</span>
              )}
              <span>·</span>
              <span className="text-[#006398] font-medium">
                Ref: ₹
                {item.unitBenchmark !== undefined
                  ? `${item.unitBenchmark.toLocaleString("en-IN")} / unit`
                  : item.benchmarkAmount?.toLocaleString("en-IN") || "0"}
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Overcharge badge & chevron */}
        <div className="flex items-center justify-between md:justify-end gap-4 shrink-0 pl-4 md:pl-0 border-t md:border-t-0 border-[#f0f4fb] pt-2 md:pt-0">
          <div className="flex flex-col items-start md:items-end">
            {isOvercharge ? (
              <span className="font-headline text-lg sm:text-xl font-bold text-[#bd0013] tabular-nums">
                +₹{item.possibleOvercharge?.toLocaleString("en-IN")} POSSIBLE OVERCHARGE
              </span>
            ) : (
              <span className="font-headline text-lg sm:text-xl font-bold text-[#166534] tabular-nums">
                ₹0.00 FAIR REF
              </span>
            )}
            <span className="text-[11px] font-semibold text-[#6b7280]">
              {item.source || "Statutory Rate Card"}
            </span>
          </div>

          <span
            className={`material-symbols-outlined text-[#6b7280] transition-transform duration-200 text-[22px] ${
              isExpanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          >
            expand_more
          </span>
        </div>
      </div>

      {/* Expandable Evidence Drawer */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-6 sm:pb-6 bg-[#faf8f6] border-t border-[#e5e1dc] pt-4 flex flex-col gap-3">
          <div className="p-4 rounded-lg bg-white border border-[#e5e1dc] shadow-2xs flex flex-col gap-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 text-[#bd0013]">
                <span className="material-symbols-outlined text-[18px]">
                  gavel
                </span>
                <span className="text-xs font-bold uppercase tracking-wider">
                  Benchmark Evidence &amp; Grounds
                </span>
              </div>
              {item.clause && (
                <span className="text-[11px] font-bold px-2 py-0.5 bg-[#f0f4fb] text-[#171c21] rounded border border-[#dee3e9]">
                  {item.clause}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#171c21] leading-relaxed">
              {item.explanation ||
                "Charge exceeds published public benchmark reference rate."}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#f0f4fb]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#f0f4fb] text-[#4b5563] border border-[#dee3e9]">
                  Authority: NPPA &amp; CGHS Central Gazette
                </span>
                <span className="text-[11px] font-medium px-2 py-1 rounded bg-[#f0f4fb] text-[#4b5563] border border-[#dee3e9]">
                  Non-accusatory Patient Inquiry Ground
                </span>
              </div>

              {onEditClick && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditClick(item);
                  }}
                  className="px-3 py-1 bg-white hover:bg-[#f0f4fb] border border-[#dee3e9] rounded text-xs font-bold text-[#171c21] flex items-center gap-1 transition-colors focus-ring"
                >
                  <span className="material-symbols-outlined text-[14px]">
                    edit
                  </span>
                  <span>Adjust Fields</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
