import Link from "next/link";

interface SampleItem {
  id: string;
  cptCode: string;
  description: string;
  billedAmount: number;
  benchmarkAmount: number;
  possibleOvercharge: number;
  explanation: string;
}

const sampleItems: SampleItem[] = [
  {
    id: "item-1",
    cptCode: "99285",
    description: "Emergency Dept Visit - High Severity",
    billedAmount: 950.0,
    benchmarkAmount: 450.0,
    possibleOvercharge: 500.0,
    explanation: "Exceeds estimated 80th percentile regional commercial benchmark for CPT 99285.",
  },
  {
    id: "item-2",
    cptCode: "80053",
    description: "Comprehensive Metabolic Panel",
    billedAmount: 275.0,
    benchmarkAmount: 125.0,
    possibleOvercharge: 150.0,
    explanation: "Exceeds standard clinical laboratory fee schedule for regional facilities.",
  },
  {
    id: "item-3",
    cptCode: "71046",
    description: "Chest X-Ray 2 Views",
    billedAmount: 200.0,
    benchmarkAmount: 200.0,
    possibleOvercharge: 0.0,
    explanation: "Charge aligns with regional benchmark standard.",
  },
];

export default function AuditPage() {
  const totalBilled = sampleItems.reduce((acc, item) => acc + item.billedAmount, 0);
  const totalPossibleOvercharge = sampleItems.reduce(
    (acc, item) => acc + item.possibleOvercharge,
    0
  );

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Medical Bill Audit
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Audit itemized charges to identify possible overcharges.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer">
            Upload New Bill
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Total Billed
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            ${totalBilled.toFixed(2)}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-amber-500/30 bg-amber-500/5">
          <div className="text-xs font-medium text-amber-400 uppercase tracking-wider">
            Total Possible Overcharge
          </div>
          <div className="text-2xl font-bold text-amber-300 mt-2">
            ${totalPossibleOvercharge.toFixed(2)}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Audited Items
          </div>
          <div className="text-2xl font-bold text-white mt-2">
            {sampleItems.length}
          </div>
        </div>
      </div>

      {/* Audit Line Items Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-white">Itemized Audit Results</h2>
          <span className="text-xs text-slate-400">Provider: Metro General Hospital</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/60 text-xs text-slate-400 uppercase font-medium">
              <tr>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3 text-right">Billed</th>
                <th className="px-6 py-3 text-right">Benchmark</th>
                <th className="px-6 py-3 text-right">Possible Overcharge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {sampleItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-blue-400">{item.cptCode}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{item.description}</div>
                    <div className="text-xs text-slate-400 mt-0.5">{item.explanation}</div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-200">
                    ${item.billedAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-400">
                    ${item.benchmarkAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right font-mono font-medium">
                    {item.possibleOvercharge > 0 ? (
                      <span className="text-amber-400">
                        +${item.possibleOvercharge.toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-emerald-400">$0.00</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Notice and Legal Disclaimer */}
      <div className="p-4 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
        <p>
          <strong className="text-slate-300">Privacy Notice:</strong> FairBill does not store uploaded bill files or raw bill text. All files are processed in ephemeral memory.
        </p>
        <p>
          <strong className="text-slate-300">Disclaimer:</strong> All findings reflect possible overcharges based on regional benchmark pricing data and do not constitute legal advice or allegations of improper conduct.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 text-sm rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
