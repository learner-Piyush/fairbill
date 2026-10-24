"use client";

import { useState } from "react";
import Link from "next/link";
import sampleAuditFixture from "@/fixtures/sample-audit.json";
import { AuditSummaryCard } from "@/components/AuditSummaryCard";
import { LineItemRow, AuditItemData } from "@/components/LineItemRow";
import { EditItemModal } from "@/components/EditItemModal";
import { ProgressSteps } from "@/components/ProgressSteps";

interface AuditState {
  id: string;
  providerName: string;
  invoiceNumber: string;
  date: string;
  patientName: string;
  ipNumber: string;
  admissionType: string;
  totalBilled: number;
  totalPossibleOvercharge: number;
  benchmarkCeiling: number;
  status: string;
  disclaimer: string;
  categories: { id: string; name: string; count: number; amount: number; badgeClass?: string }[];
  items: AuditItemData[];
}

export default function AuditPage() {
  const [auditData, setAuditData] = useState<AuditState>(
    sampleAuditFixture as unknown as AuditState
  );
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [editingItem, setEditingItem] = useState<AuditItemData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  // Recalculate summary metrics dynamically if items are edited
  const items = auditData.items;
  const totalBilled = items.reduce((acc, it) => acc + it.billedAmount, 0);
  const totalPossibleOvercharge = items.reduce(
    (acc, it) => acc + (it.possibleOvercharge ?? 0),
    0
  );
  const benchmarkCeiling = items.reduce(
    (acc, it) => acc + (it.benchmarkAmount ?? 0),
    0
  );

  const filteredItems = items.filter((item) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "high"
        ? item.status === "HIGH"
        : filter === "duplicate"
        ? item.status === "DUPLICATE"
        : filter === "review"
        ? item.status === "REVIEW"
        : filter === "fair"
        ? item.status === "FAIR"
        : true;

    const matchesSearch =
      searchQuery === ""
        ? true
        : item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.cptCode &&
            item.cptCode.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handleEditClick = (item: AuditItemData) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleSaveItem = (updated: AuditItemData) => {
    const updatedItems = items.map((it) => (it.id === updated.id ? updated : it));
    setAuditData({
      ...auditData,
      items: updatedItems,
      totalBilled: updatedItems.reduce((acc, it) => acc + it.billedAmount, 0),
      totalPossibleOvercharge: updatedItems.reduce(
        (acc, it) => acc + (it.possibleOvercharge ?? 0),
        0
      ),
      benchmarkCeiling: updatedItems.reduce(
        (acc, it) => acc + (it.benchmarkAmount ?? 0),
        0
      ),
    });
  };

  const summaryData = {
    id: auditData.id,
    providerName: auditData.providerName,
    invoiceNumber: auditData.invoiceNumber,
    date: auditData.date,
    totalBilled,
    totalPossibleOvercharge,
    benchmarkCeiling,
    status: auditData.status,
    categories: auditData.categories,
  };

  return (
    <div className="flex flex-col gap-6 sm:gap-8 pb-10">
      {/* Top Controls / Simulation Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-[#e5e1dc] shadow-2xs">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="text-xs font-bold text-[#4b5563] hover:text-[#171c21] flex items-center gap-1 focus-ring rounded"
          >
            <span className="material-symbols-outlined text-[16px]">
              arrow_back
            </span>
            <span>New Bill</span>
          </Link>
          <span className="text-[#dee3e9]">|</span>
          <span className="text-xs font-semibold text-[#171c21]">
            Active Audit Session: #{auditData.invoiceNumber}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowProcessing(!showProcessing)}
            className="px-3 py-1.5 rounded-lg bg-[#f0f4fb] hover:bg-[#eaeef5] border border-[#dee3e9] text-xs font-bold text-[#006398] flex items-center gap-1.5 transition-colors focus-ring"
          >
            <span className="material-symbols-outlined text-[16px]">
              {showProcessing ? "receipt_long" : "autorenew"}
            </span>
            <span>
              {showProcessing ? "View Audit Report" : "Simulate Processing Engine"}
            </span>
          </button>
        </div>
      </div>

      {/* Conditional Processing Engine View */}
      {showProcessing ? (
        <ProgressSteps
          currentStep={2}
          onComplete={() => setShowProcessing(false)}
        />
      ) : (
        <>
          {/* Main Audit Summary Card */}
          <AuditSummaryCard
            audit={summaryData}
            onEditClick={() => {
              const firstItem = items[0];
              if (firstItem) handleEditClick(firstItem);
            }}
          />

          {/* Filter Bar & Search */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
            {/* Filter Pills */}
            <div
              className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0"
              role="group"
              aria-label="Filter line items by status"
            >
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus-ring shrink-0 ${
                  filter === "all"
                    ? "bg-[#171c21] text-white shadow-xs"
                    : "bg-white hover:bg-[#f0f4fb] text-[#4b5563] border border-[#dee3e9]"
                }`}
              >
                All Items ({items.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("high")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus-ring shrink-0 flex items-center gap-1.5 ${
                  filter === "high"
                    ? "bg-[#bd0013] text-white shadow-xs"
                    : "bg-white hover:bg-[#f0f4fb] text-[#4b5563] border border-[#dee3e9]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#bd0013]" />
                High Flags ({items.filter((it) => it.status === "HIGH").length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("duplicate")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus-ring shrink-0 flex items-center gap-1.5 ${
                  filter === "duplicate"
                    ? "bg-[#b26000] text-white shadow-xs"
                    : "bg-white hover:bg-[#f0f4fb] text-[#4b5563] border border-[#dee3e9]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#b26000]" />
                Duplicates ({items.filter((it) => it.status === "DUPLICATE").length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("review")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus-ring shrink-0 flex items-center gap-1.5 ${
                  filter === "review"
                    ? "bg-[#006398] text-white shadow-xs"
                    : "bg-white hover:bg-[#f0f4fb] text-[#4b5563] border border-[#dee3e9]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#006398]" />
                Needs Review ({items.filter((it) => it.status === "REVIEW").length})
              </button>
              <button
                type="button"
                onClick={() => setFilter("fair")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all focus-ring shrink-0 flex items-center gap-1.5 ${
                  filter === "fair"
                    ? "bg-[#166534] text-white shadow-xs"
                    : "bg-white hover:bg-[#f0f4fb] text-[#4b5563] border border-[#dee3e9]"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#166534]" />
                Fair / OK ({items.filter((it) => it.status === "FAIR").length})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search line items..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-[#dee3e9] rounded-lg text-xs font-medium text-[#171c21] focus-ring"
                aria-label="Filter line items by keyword"
              />
            </div>
          </div>

          {/* Subtext info */}
          <div className="flex items-center justify-between text-xs text-[#6b7280] px-1">
            <span>Tap any line item row to inspect statutory source and dispute grounds</span>
            <span className="hidden sm:inline">Calculations updated per latest Central Gazette</span>
          </div>

          {/* Line Item Rows List */}
          <div className="flex flex-col gap-3">
            {filteredItems.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center border border-[#e5e1dc] text-[#6b7280] text-sm">
                No items match your filter criteria.
              </div>
            ) : (
              filteredItems.map((it, idx) => (
                <LineItemRow
                  key={it.id}
                  item={it}
                  defaultExpanded={idx === 0}
                  onEditClick={handleEditClick}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Edit Line Item Modal */}
      <EditItemModal
        isOpen={isModalOpen}
        item={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}
