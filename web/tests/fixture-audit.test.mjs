import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(__dirname, "../src/fixtures/sample-audit.json");

test("Sample Audit Fixture validation", async (t) => {
  await t.test("fixture file exists and parses as JSON", () => {
    assert.ok(fs.existsSync(fixturePath), "sample-audit.json should exist");
    const raw = fs.readFileSync(fixturePath, "utf-8");
    const data = JSON.parse(raw);
    assert.ok(data.id, "Audit should have an id");
    assert.ok(data.providerName, "Audit should have a provider name");
    assert.ok(data.items && Array.isArray(data.items), "Items should be an array");
    assert.ok(data.pastAudits && Array.isArray(data.pastAudits), "Past audits should be an array");
  });

  await t.test("mandatory non-accusatory disclaimer is present", () => {
    const raw = fs.readFileSync(fixturePath, "utf-8");
    const data = JSON.parse(raw);
    assert.ok(
      data.disclaimer.includes("possible overcharges"),
      "Disclaimer must mention possible overcharges"
    );
    assert.ok(
      data.disclaimer.includes("not legal advice"),
      "Disclaimer must clarify it is not legal advice"
    );
  });

  await t.test("items calculation and non-accusatory terminology", () => {
    const raw = fs.readFileSync(fixturePath, "utf-8");
    const data = JSON.parse(raw);

    for (const item of data.items) {
      assert.ok(item.id, "Each item must have an id");
      assert.ok(item.description, "Each item must have a description");
      assert.ok(typeof item.billedAmount === "number", "billedAmount must be number");

      if (item.possibleOvercharge > 0) {
        assert.ok(
          item.explanation.toLowerCase().includes("possible overcharge") ||
            item.explanation.toLowerCase().includes("possible duplicate"),
          `Item ${item.id} explanation must use compliant phrasing`
        );
      }
    }
  });

  await t.test("past audits contain required fields for history vault", () => {
    const raw = fs.readFileSync(fixturePath, "utf-8");
    const data = JSON.parse(raw);

    for (const audit of data.pastAudits) {
      assert.ok(audit.id, "Past audit must have id");
      assert.ok(audit.providerName, "Past audit must have providerName");
      assert.ok(typeof audit.totalBilled === "number", "totalBilled must be number");
      assert.ok(typeof audit.totalPossibleOvercharge === "number", "totalPossibleOvercharge must be number");
      assert.ok(["DISPUTED", "SETTLED", "PENDING"].includes(audit.status), "Status must be valid");
    }
  });
});
