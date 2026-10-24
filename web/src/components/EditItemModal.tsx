"use client";

import { useState, type FormEvent } from "react";
import { AuditItemData } from "./LineItemRow";

interface EditItemModalProps {
  isOpen: boolean;
  item: AuditItemData | null;
  onClose: () => void;
  onSave: (updatedItem: AuditItemData) => void;
}

interface EditItemFormProps {
  item: AuditItemData;
  onClose: () => void;
  onSave: (updatedItem: AuditItemData) => void;
}

function EditItemForm({ item, onClose, onSave }: EditItemFormProps) {
  const [description, setDescription] = useState(item.description);
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [unitBilled, setUnitBilled] = useState(
    item.unitBilled ||
      (item.billedAmount && item.quantity
        ? item.billedAmount / item.quantity
        : item.billedAmount)
  );
  const [unitBenchmark, setUnitBenchmark] = useState(
    item.unitBenchmark !== undefined
      ? item.unitBenchmark
      : item.benchmarkAmount && item.quantity
      ? item.benchmarkAmount / item.quantity
      : 0
  );
  const [cptCode, setCptCode] = useState(item.cptCode || "");

  const totalBilled = quantity * unitBilled;
  const totalBenchmark = quantity * unitBenchmark;
  const possibleOvercharge = Math.max(0, totalBilled - totalBenchmark);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      description,
      quantity,
      unitBilled,
      unitBenchmark,
      billedAmount: totalBilled,
      benchmarkAmount: totalBenchmark,
      possibleOvercharge,
      cptCode,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4">
      {/* Item Description */}
      <div>
        <label
          htmlFor="edit-item-desc"
          className="block text-xs font-bold uppercase tracking-wider text-[#171c21] mb-1"
        >
          Standardized Drug / Service Description
        </label>
        <input
          id="edit-item-desc"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-[44px] px-3.5 py-2 bg-[#f0f4fb] text-[#171c21] border border-[#cbd5e1] rounded-lg text-sm font-medium focus-ring focus:bg-white"
          required
        />
      </div>

      {/* CPT / Drug Code */}
      <div>
        <label
          htmlFor="edit-item-code"
          className="block text-xs font-bold uppercase tracking-wider text-[#171c21] mb-1"
        >
          Regulatory CPT / NPPA Drug Code
        </label>
        <input
          id="edit-item-code"
          type="text"
          value={cptCode}
          onChange={(e) => setCptCode(e.target.value)}
          className="w-full min-h-[44px] px-3.5 py-2 bg-[#f0f4fb] text-[#171c21] border border-[#cbd5e1] rounded-lg text-sm font-mono focus-ring focus:bg-white"
        />
      </div>

      {/* Grid of Quantities and Rates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label
            htmlFor="edit-item-qty"
            className="block text-xs font-bold uppercase tracking-wider text-[#171c21] mb-1"
          >
            Quantity
          </label>
          <input
            id="edit-item-qty"
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className="w-full min-h-[44px] px-3.5 py-2 bg-[#f0f4fb] text-[#171c21] border border-[#cbd5e1] rounded-lg text-sm font-medium tabular-nums focus-ring focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="edit-item-billed"
            className="block text-xs font-bold uppercase tracking-wider text-[#171c21] mb-1"
          >
            Billed Unit (₹)
          </label>
          <input
            id="edit-item-billed"
            type="number"
            min={0}
            value={unitBilled}
            onChange={(e) => setUnitBilled(Number(e.target.value) || 0)}
            className="w-full min-h-[44px] px-3.5 py-2 bg-[#f0f4fb] text-[#171c21] border border-[#cbd5e1] rounded-lg text-sm font-medium tabular-nums focus-ring focus:bg-white"
            required
          />
        </div>

        <div>
          <label
            htmlFor="edit-item-bench"
            className="block text-xs font-bold uppercase tracking-wider text-[#006398] mb-1"
          >
            Benchmark Cap (₹)
          </label>
          <input
            id="edit-item-bench"
            type="number"
            min={0}
            value={unitBenchmark}
            onChange={(e) => setUnitBenchmark(Number(e.target.value) || 0)}
            className="w-full min-h-[44px] px-3.5 py-2 bg-[#f0f4fb] text-[#171c21] border border-[#cbd5e1] rounded-lg text-sm font-medium tabular-nums focus-ring focus:bg-white"
          />
        </div>
      </div>

      {/* Live Recalculation Preview Banner */}
      <div className="p-4 rounded-lg bg-[#faf8f6] border border-[#e5e1dc] flex items-center justify-between flex-wrap gap-2">
        <div>
          <span className="text-[11px] uppercase font-bold text-[#6b7280] block">
            Recalculated Billed Total
          </span>
          <span className="font-headline text-lg font-bold text-[#171c21]">
            ₹{totalBilled.toLocaleString("en-IN")}
          </span>
        </div>

        <div>
          <span className="text-[11px] uppercase font-bold text-[#006398] block">
            Statutory Benchmark
          </span>
          <span className="font-headline text-lg font-bold text-[#006398]">
            ₹{totalBenchmark.toLocaleString("en-IN")}
          </span>
        </div>

        <div className="text-right">
          <span className="text-[11px] uppercase font-bold text-[#bd0013] block">
            Possible Overcharge
          </span>
          <span className="font-headline text-xl font-bold text-[#bd0013]">
            +₹{possibleOvercharge.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-3 border-t border-[#f0f4fb]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-white hover:bg-[#f0f4fb] border border-[#e5e1dc] text-[#171c21] text-xs font-bold transition-colors focus-ring"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 rounded-lg bg-[#bd0013] hover:bg-[#a10010] active:bg-[#85000d] text-white text-xs font-bold transition-all shadow-sm focus-ring"
        >
          Save &amp; Recalculate
        </button>
      </div>
    </form>
  );
}

export function EditItemModal({
  isOpen,
  item,
  onClose,
  onSave,
}: EditItemModalProps) {
  if (!isOpen || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div className="w-full sm:max-w-[640px] max-h-[90vh] flex flex-col bg-white rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden border border-[#e5e1dc] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-[#f0f4fb] border-b border-[#dee3e9] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] text-[10px] font-bold uppercase tracking-wider">
                Item Verification &amp; Correction
              </span>
              <span className="text-xs text-[#6b7280]">
                ID: {item.id}
              </span>
            </div>
            <h2
              id="modal-title"
              className="font-headline text-2xl font-bold text-[#171c21] tracking-tight"
            >
              Correct Line Item Details
            </h2>
            <p className="text-xs text-[#4b5563] mt-0.5">
              Adjust billed quantities or matched drug formulation to recalculate against statutory reference prices.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-[#eaeef5] text-[#171c21] flex items-center justify-center transition-colors border border-[#dee3e9] focus-ring"
            aria-label="Close modal"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Inner Form keyed to item.id */}
        <EditItemForm
          key={item.id}
          item={item}
          onClose={onClose}
          onSave={onSave}
        />
      </div>
    </div>
  );
}
