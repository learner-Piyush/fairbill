export type StatusType =
  | "HIGH"
  | "OVERCHARGE"
  | "DUPLICATE"
  | "REVIEW"
  | "CHECK"
  | "FAIR"
  | "OK"
  | "RESOLVED"
  | "SETTLED"
  | "PENDING"
  | "DISPUTED";

interface StatusTagProps {
  status: StatusType | string;
  label?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function StatusTag({
  status,
  label,
  size = "md",
  showIcon = true,
}: StatusTagProps) {
  const normalized = status.toUpperCase();

  let styles = "bg-slate-100 text-slate-700 border-slate-300";
  let icon = "info";
  let defaultLabel = label || status;

  if (normalized === "HIGH" || normalized === "OVERCHARGE" || normalized === "DISPUTED") {
    styles = "bg-[#FEF2F2] text-[#991B1B] border-[#F87171]";
    icon = "warning";
    defaultLabel = label || "Possible Overcharge";
  } else if (normalized === "DUPLICATE") {
    styles = "bg-[#FFFBEB] text-[#92400E] border-[#FCD34D]";
    icon = "content_copy";
    defaultLabel = label || "Possible Duplicate";
  } else if (normalized === "REVIEW" || normalized === "CHECK") {
    styles = "bg-[#F0F9FF] text-[#075985] border-[#BAE6FD]";
    icon = "help_outline";
    defaultLabel = label || "Needs Review";
  } else if (normalized === "FAIR" || normalized === "OK" || normalized === "RESOLVED" || normalized === "SETTLED") {
    styles = "bg-[#F0FDF4] text-[#166534] border-[#BBF7D0]";
    icon = "check_circle";
    defaultLabel = label || (normalized === "SETTLED" ? "Resolved & Waived" : "Fair / Verified");
  } else if (normalized === "PENDING") {
    styles = "bg-[#F8FAFC] text-[#475569] border-[#CBD5E1]";
    icon = "hourglass_empty";
    defaultLabel = label || "Review Pending";
  }

  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5 tracking-wide"
      : "text-xs px-2.5 py-1 tracking-wider";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-bold uppercase rounded border ${styles} ${sizeClasses}`}
      role="status"
    >
      {showIcon && (
        <span
          className="material-symbols-outlined text-[14px]"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span>{defaultLabel}</span>
    </span>
  );
}
