import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Audit Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Review historical audits and identify possible overcharges across your medical bills.
          </p>
        </div>
        <Link
          href="/audit"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors text-center"
        >
          New Audit
        </Link>
      </div>

      <div className="p-8 rounded-xl border border-slate-800 bg-slate-900/50 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center font-bold text-lg border border-blue-500/20">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-white">Your Audits are Private</h2>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          We securely store structured findings while permanently discarding raw uploaded documents to protect your privacy.
        </p>
        <div className="pt-2">
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            View latest sample audit &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
