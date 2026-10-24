import sampleAuditFixture from "@/fixtures/sample-audit.json";
import { DisputePack, DisputePackData } from "@/components/DisputePack";
import { AuditItemData } from "@/components/LineItemRow";

export default function DisputePage() {
  const disputeData: DisputePackData = {
    id: sampleAuditFixture.id,
    providerName: sampleAuditFixture.providerName,
    invoiceNumber: sampleAuditFixture.invoiceNumber,
    patientName: sampleAuditFixture.patientName,
    ipNumber: sampleAuditFixture.ipNumber,
    date: sampleAuditFixture.date,
    totalBilled: sampleAuditFixture.totalBilled,
    totalPossibleOvercharge: sampleAuditFixture.totalPossibleOvercharge,
    items: sampleAuditFixture.items as AuditItemData[],
  };

  return (
    <div className="pb-10 max-w-5xl mx-auto">
      <DisputePack data={disputeData} />
    </div>
  );
}
