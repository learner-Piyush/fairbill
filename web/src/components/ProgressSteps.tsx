"use client";

import { useState, useEffect } from "react";

interface StepItem {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in_progress" | "queued";
}

interface ProgressStepsProps {
  currentStep?: number;
  onComplete?: () => void;
  className?: string;
}

export function ProgressSteps({
  currentStep: initialStep = 2,
  onComplete,
  className = "",
}: ProgressStepsProps) {
  const [step, setStep] = useState(initialStep);
  const [progressPercent, setProgressPercent] = useState(68);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => {
        setStep(3);
        setProgressPercent(92);
      }, 3500);
      return () => clearTimeout(timer);
    }
    if (step === 3 && onComplete) {
      const timer = setTimeout(() => {
        setProgressPercent(100);
        onComplete();
      }, 2500);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [step, onComplete]);

  const steps: StepItem[] = [
    {
      id: 1,
      title: "1. Reading bill items (OCR)",
      description:
        "28 line items parsed: medicines, daily nursing, ICU doctor visits, and high-frequency consumables categorized.",
      status: step > 1 ? "completed" : step === 1 ? "in_progress" : "queued",
    },
    {
      id: 2,
      title: "2. Matching reference prices",
      description:
        "Querying NPPA Ceiling Prices (DPCO 2013), Pradhan Mantri Jan Aushadhi, and statutory CGHS Delhi NABH schedules.",
      status: step > 2 ? "completed" : step === 2 ? "in_progress" : "queued",
    },
    {
      id: 3,
      title: "3. Checking for issues & duplicates",
      description:
        "Auditing dual-billing of PPE/sanitizers, above-MRP drug charges, and unbundled OT surgical tray charges.",
      status: step >= 3 ? "in_progress" : "queued",
    },
  ];

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border border-[#e5e1dc] overflow-hidden ${className}`}
      role="region"
      aria-label="Audit processing steps"
    >
      {/* Header & Progress Bar */}
      <div className="p-5 sm:p-6 bg-[#f0f4fb] border-b border-[#dee3e9]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bd0013] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#bd0013]">
                Diagnostic Engine Active
              </span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#171c21] tracking-tight mt-1">
              Auditing Hospital Bill Charges
            </h2>
            <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5">
              Cross-referencing itemized charges against statutory price ceilings.
            </p>
          </div>
          <div className="text-right sm:self-center">
            <span className="font-headline text-2xl sm:text-3xl font-bold text-[#bd0013]">
              {progressPercent}%
            </span>
            <span className="block text-[11px] font-semibold text-[#6b7280] uppercase tracking-wider">
              Calculation Phase
            </span>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div
          className="mt-4 w-full bg-[#dee3e9] h-2.5 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="bg-[#bd0013] h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col gap-6">
        {/* Live Anomaly Scanner Capsule */}
        <div className="bg-[#f0f4fb] border border-[#e5e1dc] p-4 rounded-lg flex items-start gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5] flex items-center justify-center shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-[18px]">flag</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#991b1b]">
                Real-Time Anomaly Scanner
              </span>
              <span className="text-[11px] font-bold px-2.5 py-0.5 bg-[#fee2e2] text-[#991b1b] rounded-full border border-[#fca5a5]">
                4 Preliminary Flags
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#171c21] leading-relaxed">
              Identified 4 possible anomalies under review:{" "}
              <strong className="text-[#991b1b]">Paracetamol IV (DPCO Cap breach)</strong>,{" "}
              <strong className="text-[#991b1b]">Glove Box multi-pack overcharge</strong>,{" "}
              <strong className="text-[#991b1b]">Syringe unbundling in OT</strong>.
            </p>
          </div>
        </div>

        {/* Audit Steps Timeline */}
        <div className="flex flex-col gap-4 relative">
          <div
            className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-[#dee3e9]"
            aria-hidden="true"
          />

          {steps.map((st) => (
            <div
              key={st.id}
              className={`relative flex items-start gap-4 p-3.5 rounded-lg transition-all ${
                st.status === "in_progress"
                  ? "bg-[#f0f4fb] border border-[#bae6fd] shadow-sm"
                  : st.status === "completed"
                  ? "bg-white border border-[#e5e1dc]"
                  : "bg-white/60 border border-transparent opacity-60"
              }`}
            >
              {/* Step Icon */}
              <div
                className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  st.status === "completed"
                    ? "bg-[#006398] text-white"
                    : st.status === "in_progress"
                    ? "bg-[#bd0013] text-white"
                    : "bg-[#dee3e9] text-[#6b7280]"
                }`}
              >
                {st.status === "completed" ? (
                  <span className="material-symbols-outlined text-[20px] font-bold">
                    check
                  </span>
                ) : st.status === "in_progress" ? (
                  <span className="material-symbols-outlined text-[20px] animate-pulse">
                    database
                  </span>
                ) : (
                  <span className="material-symbols-outlined text-[20px]">
                    policy
                  </span>
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span
                    className={`font-headline text-lg sm:text-xl font-bold ${
                      st.status === "in_progress"
                        ? "text-[#171c21]"
                        : st.status === "completed"
                        ? "text-[#171c21]"
                        : "text-[#6b7280]"
                    }`}
                  >
                    {st.title}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      st.status === "completed"
                        ? "bg-[#e0f2fe] text-[#006398] border border-[#bae6fd]"
                        : st.status === "in_progress"
                        ? "bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]"
                        : "bg-[#dee3e9] text-[#6b7280]"
                    }`}
                  >
                    {st.status === "completed"
                      ? "Completed"
                      : st.status === "in_progress"
                      ? "In Progress"
                      : "Queued"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#4b5563] mt-1 leading-relaxed">
                  {st.description}
                </p>

                {/* Micro Data Indicators for active step */}
                {st.id === 2 && st.status === "in_progress" && (
                  <div className="mt-2.5 flex flex-wrap gap-2 items-center">
                    <div className="bg-white border border-[#dee3e9] px-2.5 py-1 rounded text-xs font-medium text-[#171c21] flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[14px] text-[#006398]">
                        check_circle
                      </span>
                      <span>NPPA Drug Table: 100% matched</span>
                    </div>
                    <div className="bg-white border border-[#dee3e9] px-2.5 py-1 rounded text-xs font-medium text-[#171c21] flex items-center gap-1 shadow-2xs">
                      <span className="material-symbols-outlined text-[14px] text-[#bd0013] animate-spin">
                        refresh
                      </span>
                      <span>CGHS Procedures: 14/19 verified</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empathetic Support Notice */}
        <div className="bg-[#f0f4fb] border border-[#e5e1dc] p-4 rounded-lg flex items-start gap-3">
          <span className="material-symbols-outlined text-[#006398] text-[22px] shrink-0 mt-0.5">
            volunteer_activism
          </span>
          <div className="text-xs sm:text-sm text-[#4b5563] leading-relaxed">
            <strong className="font-bold text-[#171c21] block mb-0.5">
              Take a deep breath.
            </strong>
            Most hospital billing desks permit line-item corrections before final discharge clearance. Once FairBill generates your itemized dispute pack, you will hold concrete, legal-backed reference points to negotiate calmly without adversarial conflict.
          </div>
        </div>
      </div>
    </div>
  );
}
