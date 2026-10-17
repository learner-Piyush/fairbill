import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center text-center py-12 sm:py-20">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-6">
        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        Zero-Retention Privacy First
      </div>

      <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl leading-tight">
        Discover <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Possible Overcharges</span> on Your Medical Bills
      </h1>

      <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
        FairBill audits itemized hospital bills against regional commercial and Medicare fee schedules. We never persist your uploaded files or raw bill text.
      </p>

      <div className="mt-10 flex flex-wrap gap-4 justify-center">
        <Link
          href="/audit"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
        >
          Start Bill Audit
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg bg-slate-800/90 hover:bg-slate-750 text-slate-200 border border-slate-700 font-medium transition-all"
        >
          View Dashboard
        </Link>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left w-full">
        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-semibold mb-4 border border-blue-500/20">
            01
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Ephemeral Analysis</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Uploaded bills are processed in-memory and immediately destroyed. We only store structured audit line items.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-semibold mb-4 border border-indigo-500/20">
            02
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Code & Price Benchmarking</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Standard CPT and HCPCS codes are matched against regional fair pricing to detect possible overcharges.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-semibold mb-4 border border-emerald-500/20">
            03
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Respectful Resolution</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Generate formal itemization inquiries to negotiate with billing departments without adversarial accusations.
          </p>
        </div>
      </div>
    </div>
  );
}
