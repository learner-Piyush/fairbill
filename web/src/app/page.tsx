import { UploadZone } from "@/components/UploadZone";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto gap-8 sm:gap-10 pb-8">
      {/* Hero Headline Unit */}
      <div className="flex flex-col gap-3 text-left pt-2">
        <div className="inline-flex items-center gap-2 self-start px-3 py-1 bg-[#eaeef5] rounded-full border border-[#dee3e9] shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-[#bd0013] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wide text-[#4b5563]">
            Autonomous Medical Bill Adjudication
          </span>
        </div>

        <h1 className="font-headline text-4xl sm:text-6xl font-bold text-[#171c21] tracking-tight leading-tight">
          Stop Overpaying on{" "}
          <span className="text-[#bd0013] underline decoration-[#bd0013]/30 decoration-4">
            Hospital Bills
          </span>{" "}
          in India.
        </h1>

        <p className="font-body text-base sm:text-xl text-[#4b5563] font-medium leading-relaxed max-w-3xl">
          Verify every medicine, consumable, daily bed tariff, and surgical line item against statutory NPPA DPCO price caps and CGHS package benchmarks before you settle discharge payments.
        </p>
      </div>

      {/* Official Benchmarks Trust Ribbon */}
      <div className="p-4 sm:p-5 bg-white rounded-xl shadow-2xs border border-[#e5e1dc] flex items-start sm:items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-[#f0f4fb] border border-[#dee3e9] flex items-center justify-center shrink-0 text-[#006398]">
          <span className="material-symbols-outlined text-[26px]">
            verified_user
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            Statutory Price Ceilings Monitored
          </span>
          <p className="text-xs sm:text-sm text-[#171c21] font-semibold mt-0.5 leading-snug">
            Referenced against NPPA DPCO Drug Price Gazette, Jan Aushadhi bio-equivalents, and Supreme Court healthcare pricing guidelines.
          </p>
        </div>
      </div>

      {/* Main Diagnostic Bill Upload Zone */}
      <UploadZone />

      {/* Pathology Breakdown: Private Hospital Markup Tactics */}
      <div className="bg-white rounded-xl p-5 sm:p-8 shadow-2xs border border-[#e5e1dc] flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#f0f4fb] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#bd0013]">
              Billing Pathology Breakdown
            </span>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-[#171c21] mt-0.5">
              Common Tactics Private Hospitals Use to Inflate Charges
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#6b7280] bg-[#f0f4fb] px-2.5 py-1 rounded border border-[#dee3e9] self-start sm:self-auto">
            National Healthcare Audit Study
          </span>
        </div>

        {/* Aggregate Markup Bar */}
        <div className="bg-[#f0f4fb] border border-[#e5e1dc] rounded-lg p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex justify-between items-baseline text-[#171c21] flex-wrap gap-2">
            <span className="text-xs sm:text-sm font-bold">
              Average Unjustified Markup Identified Across 14,000+ Hospital Invoices
            </span>
            <span className="font-headline text-2xl sm:text-3xl font-bold text-[#bd0013] tabular-nums">
              +28.4%
            </span>
          </div>

          {/* Segmented Color Bar */}
          <div
            className="w-full h-3.5 bg-[#dee3e9] rounded-full overflow-hidden flex"
            role="img"
            aria-label="Markup distribution: 44% Consumables, 32% Unbundled PPE, 24% Procedure Markups"
          >
            <div
              className="h-full bg-[#bd0013]"
              style={{ width: "44%" }}
              title="Pharmacy & Consumables (44%)"
            />
            <div
              className="h-full bg-[#b26000]"
              style={{ width: "32%" }}
              title="Unbundled PPE & Nursing (32%)"
            />
            <div
              className="h-full bg-[#006398]"
              style={{ width: "24%" }}
              title="Procedure Markups (24%)"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs text-[#4b5563] pt-1 gap-2 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#bd0013]" />
              Consumables &amp; Injections (44%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#b26000]" />
              Unbundled PPE / Nursing (32%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006398]" />
              Procedure Markups (24%)
            </span>
          </div>
        </div>

        {/* 3-Point Diagnostic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#faf8f6] border border-[#e5e1dc] rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-headline text-xl font-bold text-[#bd0013]">
                  01
                </span>
                <span className="material-symbols-outlined text-[#6b7280]">
                  medication_liquid
                </span>
              </div>
              <h3 className="font-headline text-lg font-bold text-[#171c21]">
                Branded vs Generic Margins
              </h3>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                In-house pharmacies routinely dispense proprietary brands priced up to 800% higher than identical bio-equivalent DPCO or Jan Aushadhi generic salts.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#171c21] bg-white border border-[#dee3e9] px-2 py-1 rounded">
              Governed by NPPA Formulations
            </div>
          </div>

          <div className="bg-[#faf8f6] border border-[#e5e1dc] rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-headline text-xl font-bold text-[#bd0013]">
                  02
                </span>
                <span className="material-symbols-outlined text-[#6b7280]">
                  masks
                </span>
              </div>
              <h3 className="font-headline text-lg font-bold text-[#171c21]">
                Unbundled Consumables
              </h3>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Syringes, gloves, sanitizer, and standard surgical drapes are frequently line-itemed separately even though standard room and OT tariffs are composite packages.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#171c21] bg-white border border-[#dee3e9] px-2 py-1 rounded">
              Violates Composite Tariff Rules
            </div>
          </div>

          <div className="bg-[#faf8f6] border border-[#e5e1dc] rounded-lg p-4 flex flex-col justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-headline text-xl font-bold text-[#bd0013]">
                  03
                </span>
                <span className="material-symbols-outlined text-[#6b7280]">
                  monitor_heart
                </span>
              </div>
              <h3 className="font-headline text-lg font-bold text-[#171c21]">
                Phantom Overhead Multipliers
              </h3>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                High-tier room rents are weaponized to artificially scale doctor consultation fees, diagnostic lab tiers, and equipment handling rates in lockstep.
              </p>
            </div>
            <div className="text-[11px] font-bold text-[#171c21] bg-white border border-[#dee3e9] px-2 py-1 rounded">
              Subject to Supreme Court Precedent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
