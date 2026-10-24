"use client";

import { useRouter } from "next/navigation";
import { ProgressSteps } from "@/components/ProgressSteps";

export default function ProcessingPage() {
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto py-6 sm:py-10">
      <ProgressSteps
        currentStep={2}
        onComplete={() => router.push("/audit")}
      />
    </div>
  );
}
