"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

interface UploadZoneProps {
  onAuditStart?: (fileName: string) => void;
  className?: string;
}

export function UploadZone({ onAuditStart, className = "" }: UploadZoneProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorHighlight, setErrorHighlight] = useState(false);

  const sampleBills = [
    {
      id: "fortis",
      name: "Fortis_Memorial_ICU_Summary_Aug24.pdf",
      label: "Fortis ICU Multi-day bill (₹2.4L)",
      icon: "emergency",
      iconColor: "text-[#bd0013]",
    },
    {
      id: "max",
      name: "Max_Saket_Pharmacy_Slip_7819.pdf",
      label: "Max Healthcare pharmacy bill (₹48.2k)",
      icon: "medication",
      iconColor: "text-[#006398]",
    },
    {
      id: "apollo",
      name: "Apollo_Cardiology_Implant_Bill.pdf",
      label: "Apollo surgical stent invoice (₹1.85L)",
      icon: "medical_services",
      iconColor: "text-[#b26000]",
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file.name);
      setErrorHighlight(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0].name);
      setErrorHighlight(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSampleSelect = (sampleName: string) => {
    setSelectedFile(sampleName);
    setErrorHighlight(false);
  };

  const handleAuditClick = () => {
    if (!selectedFile) {
      setErrorHighlight(true);
      setTimeout(() => setErrorHighlight(false), 800);
      return;
    }

    setIsSubmitting(true);
    if (onAuditStart) {
      onAuditStart(selectedFile);
    } else {
      // Simulate ephemeral processing route transition
      router.push("/audit");
    }
  };

  return (
    <div
      className={`bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-[#e5e1dc] flex flex-col gap-5 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#bd0013] text-[22px]">
            document_scanner
          </span>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#171c21]">
            Document Ingestion
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-[#4b5563] bg-[#f0f4fb] px-2.5 py-0.5 rounded-full border border-[#dee3e9]">
          Encrypted Ephemeral Memory
        </span>
      </div>

      {/* Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload medical bill document or pharmacy slip"
        className={`relative group cursor-pointer rounded-lg p-6 flex flex-col items-center justify-center text-center transition-all duration-200 min-h-[200px] border-2 border-dashed focus-ring ${
          errorHighlight
            ? "bg-[#ffdad6] border-[#bd0013]"
            : isDragging
            ? "bg-[#e0f2fe] border-[#006398]"
            : "bg-[#f0f4fb] hover:bg-[#eaeef5] border-[#cbd5e1]"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg,image/jpg"
          className="sr-only"
          onChange={handleFileChange}
          id="bill-upload-input"
        />

        <div className="w-14 h-14 rounded-full bg-[#dee3e9] group-hover:bg-white group-hover:scale-105 flex items-center justify-center mb-3 transition-all shadow-sm">
          <span className="material-symbols-outlined text-[#bd0013] text-[30px]">
            photo_camera
          </span>
        </div>

        <p className="font-headline text-2xl font-bold text-[#171c21] tracking-tight">
          Upload hospital bill or pharmacy receipt
        </p>
        <span className="text-xs sm:text-sm text-[#4b5563] mt-1 font-medium">
          PDF, JPG, or high-res PNG (Up to 25MB)
        </span>

        <div className="mt-4 px-3.5 py-1.5 bg-[#dee3e9] rounded-full flex items-center gap-2 max-w-md">
          <span className="material-symbols-outlined text-[#006398] text-[16px] shrink-0">
            receipt_long
          </span>
          <span className="text-xs text-[#171c21] font-medium truncate">
            Clear photos of paper discharge summaries or itemized bills work great.
          </span>
        </div>

        {/* Selected File Pill */}
        {selectedFile && (
          <div
            className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-[#cce5ff] text-[#001d31] rounded-full shadow-sm z-10 border border-[#93ccff]"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-[16px] text-[#006398]">
              check_circle
            </span>
            <span className="text-xs font-semibold truncate max-w-[220px] sm:max-w-xs">
              {selectedFile}
            </span>
            <button
              type="button"
              onClick={handleClearFile}
              className="ml-1 hover:text-[#bd0013] flex items-center p-0.5 rounded focus-ring"
              aria-label="Remove selected file"
            >
              <span className="material-symbols-outlined text-[14px]">
                close
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Sample Bills Injector */}
      <div className="flex flex-col gap-2 pt-1">
        <span className="text-xs uppercase font-bold tracking-wider text-[#4b5563] flex items-center gap-1">
          <span className="material-symbols-outlined text-[16px] text-[#b26000]">
            bolt
          </span>
          No bill on hand? Test instant scan benchmarks:
        </span>
        <div className="flex flex-wrap gap-2">
          {sampleBills.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleSampleSelect(sample.name)}
              className={`px-3 py-2 rounded text-xs font-semibold transition-all flex items-center gap-1.5 border min-h-[38px] focus-ring active:scale-95 ${
                selectedFile === sample.name
                  ? "bg-[#cce5ff] text-[#001d31] border-[#006398]"
                  : "bg-[#f0f4fb] hover:bg-[#eaeef5] text-[#171c21] border-[#dee3e9]"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[16px] ${sample.iconColor}`}
              >
                {sample.icon}
              </span>
              <span>{sample.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleAuditClick}
        className="w-full min-h-[52px] py-3 px-6 bg-[#bd0013] hover:bg-[#a10010] active:bg-[#85000d] text-white font-headline text-xl sm:text-2xl font-bold tracking-wide rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer focus-ring disabled:opacity-75 disabled:cursor-wait"
      >
        <span>
          {isSubmitting
            ? "Auditing against statutory price caps..."
            : selectedFile
            ? `Audit ${selectedFile.slice(0, 24)}...`
            : "Audit my bill now"}
        </span>
        <span className="material-symbols-outlined text-[24px]">
          arrow_forward
        </span>
      </button>

      {/* Ephemeral Non-retention Guarantee Card */}
      <div className="bg-[#f0f4fb] border border-[#e5e1dc] rounded-lg p-3.5 flex items-start gap-3">
        <div className="w-9 h-9 rounded bg-[#dee3e9] flex items-center justify-center shrink-0 text-[#171c21]">
          <span className="material-symbols-outlined text-[20px]">
            lock_reset
          </span>
        </div>
        <div className="text-xs text-[#4b5563] space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-headline text-sm font-bold text-[#171c21] tracking-wide">
              100% Ephemeral &amp; Private
            </span>
            <span className="px-1.5 py-0.5 bg-[#dee3e9] text-[#171c21] text-[10px] uppercase font-bold rounded">
              Zero Retention
            </span>
          </div>
          <p className="leading-relaxed">
            Your bill is parsed strictly in-memory and permanently purged after audit calculation. We never harvest, log, or persist sensitive identity tokens (ABHA ID, Aadhaar, insurance policy credentials, or phone numbers).
          </p>
        </div>
      </div>
    </div>
  );
}
