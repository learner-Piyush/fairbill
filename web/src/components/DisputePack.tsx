"use client";

import { useState } from "react";
import Link from "next/link";
import { AuditItemData } from "./LineItemRow";

export interface DisputePackData {
  id: string;
  providerName: string;
  invoiceNumber: string;
  patientName: string;
  ipNumber: string;
  date: string;
  totalBilled: number;
  totalPossibleOvercharge: number;
  items: AuditItemData[];
}

interface DisputePackProps {
  data: DisputePackData;
  className?: string;
}

export function DisputePack({ data, className = "" }: DisputePackProps) {
  const [activeTab, setActiveTab] = useState<"hospital" | "nch" | "citations">("hospital");
  const [copied, setCopied] = useState(false);

  const disputedItems = data.items.filter(
    (item) => (item.possibleOvercharge ?? 0) > 0
  );

  const getFullDraftText = () => {
    return `TO:
The Medical Superintendent & Chief Billing Officer
${data.providerName}

SUBJECT: Formal Representation & Request for Itemized Billing Reconsideration regarding Provisional Invoice #${data.invoiceNumber} for Patient ${data.patientName} (IP No. ${data.ipNumber})

Dear Sir / Madam,

Upon review of the provisional hospital bill dated ${data.date} for Patient ${data.patientName} admitted under your care, an automated diagnostic check against publicly gazetted reference ceilings established by the National Pharmaceutical Pricing Authority (NPPA) and CGHS guidelines indicates total possible overcharges of ₹${data.totalPossibleOvercharge.toLocaleString("en-IN")}.

ITEMIZED FINDINGS FOR RECONSIDERATION:
${disputedItems
  .map(
    (item, idx) =>
      `${idx + 1}. ${item.description}\n   - Billed: ₹${item.billedAmount.toLocaleString("en-IN")}\n   - Reference Cap: ₹${(item.benchmarkAmount ?? 0).toLocaleString("en-IN")}\n   - Possible Overcharge: ₹${(item.possibleOvercharge ?? 0).toLocaleString("en-IN")}\n   - Authority: ${item.source || "Statutory Rate Schedule"}`
  )
  .join("\n\n")}

We respectfully request an itemized billing reconciliation and fee adjustment before final discharge clearance.

FairBill flags possible overcharges against public reference prices. This correspondence is a polite request for clarification and does not constitute legal advice.

Sincerely,
${data.patientName}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getFullDraftText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `FairBill Dispute Pack - ${data.providerName}`,
        text: getFullDraftText(),
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div
      className={`flex flex-col gap-6 ${className}`}
      role="region"
      aria-label="Dispute Pack generator"
    >
      {/* Top Header Card */}
      <div className="bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-[#e5e1dc] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs uppercase font-bold tracking-wider text-[#bd0013]">
              Formal Dispute Dossier
            </span>
            <span className="text-xs font-mono text-[#6b7280]">
              Ref: {data.invoiceNumber}
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]">
              {disputedItems.length} Disputed Items
            </span>
          </div>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-[#171c21] tracking-tight">
            Itemized Representation Notice
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5">
            Patient: {data.patientName} ({data.ipNumber}) • Facility: {data.providerName}
          </p>
        </div>

        <div className="text-left md:text-right">
          <span className="text-xs uppercase font-bold tracking-wider text-[#bd0013] block">
            Total Possible Overcharge to Reconcile
          </span>
          <span className="font-headline text-3xl sm:text-4xl font-bold text-[#bd0013] tabular-nums">
            ₹{data.totalPossibleOvercharge.toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={handlePrint}
          className="min-h-[48px] px-4 py-2.5 bg-[#bd0013] hover:bg-[#a10010] active:bg-[#85000d] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all focus-ring"
        >
          <span className="material-symbols-outlined text-[20px]">
            picture_as_pdf
          </span>
          <span>Download Formal Dispute PDF</span>
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="min-h-[48px] px-4 py-2.5 bg-[#171c21] hover:bg-[#2c3136] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all focus-ring"
        >
          <span className="material-symbols-outlined text-[20px]">share</span>
          <span>Share WhatsApp / Email</span>
        </button>

        <button
          type="button"
          onClick={handleCopy}
          className="min-h-[48px] px-4 py-2.5 bg-white hover:bg-[#f0f4fb] border border-[#e5e1dc] text-[#171c21] text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all focus-ring"
        >
          <span className="material-symbols-outlined text-[20px]">
            {copied ? "check" : "content_copy"}
          </span>
          <span>{copied ? "Copied to Clipboard!" : "Copy Entire Draft"}</span>
        </button>
      </div>

      {/* Main Tabs Navigation */}
      <div
        className="flex items-center gap-1.5 p-1.5 bg-[#f0f4fb] rounded-xl overflow-x-auto border border-[#dee3e9]"
        role="tablist"
        aria-label="Dispute document formats"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "hospital"}
          onClick={() => setActiveTab("hospital")}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 focus-ring ${
            activeTab === "hospital"
              ? "bg-white text-[#bd0013] shadow-sm border border-[#dee3e9]"
              : "text-[#4b5563] hover:text-[#171c21]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            local_hospital
          </span>
          <span>Hospital Superintendent Notice</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "nch"}
          onClick={() => setActiveTab("nch")}
          className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 focus-ring ${
            activeTab === "nch"
              ? "bg-white text-[#bd0013] shadow-sm border border-[#dee3e9]"
              : "text-[#4b5563] hover:text-[#171c21]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">balance</span>
          <span>NCH / INGRAM Grievance</span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "citations"}
          onClick={() => setActiveTab("citations")}
          className={`flex-1 min-w-[190px] py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-1.5 focus-ring ${
            activeTab === "citations"
              ? "bg-white text-[#bd0013] shadow-sm border border-[#dee3e9]"
              : "text-[#4b5563] hover:text-[#171c21]"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            menu_book
          </span>
          <span>Statutory Citations</span>
        </button>
      </div>

      {/* Tab Panel 1: Hospital Notice */}
      {activeTab === "hospital" && (
        <div
          role="tabpanel"
          className="bg-white rounded-xl shadow-sm border border-[#e5e1dc] p-5 sm:p-8 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4fb] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bd0013] animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#4b5563]">
                Formal Representation Mode · Ready for Discharge Desk
              </span>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#f0f4fb] text-[#171c21] border border-[#dee3e9]">
              CCPA-2019-COMPLIANT
            </span>
          </div>

          {/* Letter Document Simulation */}
          <div className="bg-[#faf8f6] border border-[#e5e1dc] p-5 sm:p-7 rounded-lg text-xs sm:text-sm text-[#171c21] space-y-4 font-sans leading-relaxed">
            <div className="space-y-0.5 font-medium">
              <p className="font-bold text-[#171c21]">TO:</p>
              <p>The Medical Superintendent &amp; Chief Billing Officer</p>
              <p className="text-[#4b5563]">{data.providerName}</p>
            </div>

            <div className="bg-white p-3.5 rounded border border-[#e5e1dc]">
              <p className="font-bold text-[#171c21]">
                <span className="text-[#bd0013]">SUBJECT:</span> Formal Representation &amp; Inquiry regarding Provisional Hospital Invoice #{data.invoiceNumber} for Patient {data.patientName} (IP No. {data.ipNumber}) Under DPCO 2013 and Section 2(47) of Consumer Protection Act 2019.
              </p>
            </div>

            <p>Dear Sir / Madam,</p>

            <p>
              Upon scrutiny of the provisional discharge bill dated {data.date} for Patient <strong>{data.patientName}</strong> admitted under your care, an automated review against publicly gazetted reference ceilings established by the <strong>National Pharmaceutical Pricing Authority (NPPA)</strong> and <strong>NABH/CGHS Guidelines</strong> highlights total possible overcharges of <strong className="text-[#bd0013]">₹{data.totalPossibleOvercharge.toLocaleString("en-IN")}</strong>.
            </p>

            {/* Embedded Table of Disputed Items */}
            <div className="overflow-x-auto my-3 border border-[#e5e1dc] rounded-lg">
              <table className="w-full text-left text-xs text-[#171c21]">
                <thead className="bg-[#f0f4fb] text-[#4b5563] font-bold uppercase tracking-wider border-b border-[#dee3e9]">
                  <tr>
                    <th className="p-3">Item Description</th>
                    <th className="p-3">Billed Rate</th>
                    <th className="p-3">Govt / Reference Cap</th>
                    <th className="p-3">Possible Overcharge</th>
                    <th className="p-3">Statutory Citation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e1dc] bg-white">
                  {disputedItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[#f0f4fb]/50">
                      <td className="p-3 font-semibold">{item.description}</td>
                      <td className="p-3 font-mono text-[#bd0013] font-semibold">
                        ₹{item.unitBilled ? item.unitBilled.toLocaleString("en-IN") : item.billedAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-mono text-[#006398] font-semibold">
                        ₹{item.unitBenchmark !== undefined ? item.unitBenchmark.toLocaleString("en-IN") : (item.benchmarkAmount ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-mono font-bold text-[#bd0013]">
                        +₹{(item.possibleOvercharge ?? 0).toLocaleString("en-IN")}
                      </td>
                      <td className="p-3 font-mono text-[11px] text-[#4b5563]">
                        {item.source}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p>
              In line with the <strong>Supreme Court precedent on Healthcare Price Standardization</strong> and mandatory DPCO ceiling caps, we respectfully request that your billing department issue an adjusted, itemized invoice reflecting statutory benchmarks prior to final settlement.
            </p>

            <p className="text-xs text-[#6b7280] italic">
              Notice: FairBill flags possible overcharges against public reference prices. It is not legal advice.
            </p>

            <div className="pt-2">
              <p className="font-semibold text-[#171c21]">Sincerely,</p>
              <p className="font-medium text-[#4b5563]">{data.patientName}</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab Panel 2: NCH Grievance */}
      {activeTab === "nch" && (
        <div
          role="tabpanel"
          className="bg-white rounded-xl shadow-sm border border-[#e5e1dc] p-5 sm:p-8 flex flex-col gap-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4fb]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4b5563]">
              National Consumer Helpline (NCH / INGRAM) Portal Text
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#f0f4fb] text-[#171c21]">
              Portal Copy Ready
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#4b5563]">
            If hospital administrative desk refuses to provide itemized bills or adjust charges exceeding DPCO statutory ceilings, you can lodge an online consumer grievance via the Ministry of Consumer Affairs INGRAM portal (Toll-Free 1915).
          </p>

          <div className="bg-[#faf8f6] border border-[#e5e1dc] p-4 rounded-lg font-mono text-xs leading-relaxed text-[#171c21] whitespace-pre-wrap">
            {`GRIEVANCE SUMMARY:
Complainant: ${data.patientName}
Respondent: ${data.providerName}
Provisional Bill Number: ${data.invoiceNumber}
Total Disputed Amount: ₹${data.totalPossibleOvercharge.toLocaleString("en-IN")}

Grievance Details:
Provisional inpatient hospital bill includes charges exceeding mandatory statutory price ceilings issued under NPPA Orders (DPCO 2013) and unbundled overhead fees contrary to Consumer Protection Act 2019 standards. Billed amount reflects total possible overcharges of ₹${data.totalPossibleOvercharge.toLocaleString("en-IN")}.`}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 bg-[#171c21] hover:bg-[#2c3136] text-white text-xs font-bold rounded-lg transition-colors focus-ring"
            >
              {copied ? "Copied!" : "Copy Grievance Text"}
            </button>
            <a
              href="https://consumerhelpline.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-white hover:bg-[#f0f4fb] border border-[#e5e1dc] text-[#006398] text-xs font-bold rounded-lg transition-colors flex items-center gap-1 focus-ring"
            >
              <span>Open consumerhelpline.gov.in</span>
              <span className="material-symbols-outlined text-[16px]">
                open_in_new
              </span>
            </a>
          </div>
        </div>
      )}

      {/* Tab Panel 3: Citations */}
      {activeTab === "citations" && (
        <div
          role="tabpanel"
          className="bg-white rounded-xl shadow-sm border border-[#e5e1dc] p-5 sm:p-8 flex flex-col gap-5"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#f0f4fb]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#4b5563]">
              Statutory Basis &amp; Central Gazette Benchmarks
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#f0f4fb] text-[#171c21]">
              Legal Reference Compendium
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[#faf8f6] border border-[#e5e1dc] flex flex-col gap-2">
              <span className="font-bold text-xs uppercase text-[#bd0013]">
                1. Drugs Prices Control Order (DPCO 2013)
              </span>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Empowered under Section 3 of the Essential Commodities Act, 1955. Hospitals cannot bill scheduled formulations or medical devices above national ceiling prices gazetted by NPPA. Overcharging triggers mandatory refund with interest.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#faf8f6] border border-[#e5e1dc] flex flex-col gap-2">
              <span className="font-bold text-xs uppercase text-[#b26000]">
                2. CGHS Package Guidelines (Composite Tariffs)
              </span>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Standardizes healthcare procedures. Room rent, nursing, gloves, sanitizers, and infection management are bundled composite charges that cannot be unbundled into separate line-item tariffs.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#faf8f6] border border-[#e5e1dc] flex flex-col gap-2">
              <span className="font-bold text-xs uppercase text-[#006398]">
                3. Consumer Protection Act 2019 (CCPA)
              </span>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Section 2(47) defines unfair trade practice, including charging in excess of the price displayed or fixed by law. Patients have statutory rights to itemized billing breakdowns before making payment.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#faf8f6] border border-[#e5e1dc] flex flex-col gap-2">
              <span className="font-bold text-xs uppercase text-[#166534]">
                4. Supreme Court Hospital Pricing Orders
              </span>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Directives requiring state clinical establishments to publish standardized rate ceilings for intensive care, surgery packages, and emergency consultations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Return to Audit Button */}
      <div className="flex justify-start">
        <Link
          href="/audit"
          className="px-4 py-2 rounded-lg bg-white hover:bg-[#f0f4fb] border border-[#e5e1dc] text-[#171c21] text-xs font-bold transition-colors flex items-center gap-1.5 focus-ring"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          <span>Return to Audit Breakdown</span>
        </Link>
      </div>
    </div>
  );
}
