// SPDX-License-Identifier: MIT
import { describe, expect, it } from "vitest";
import { buildEpcPayload, formatAmount, toIso88591 } from "./epc";

const sample = {
  bic: "BYLADEM1001",
  name: "Max Mustermann",
  iban: "DE89 3704 0044 0532 0130 00",
  amountEur: 25,
};

describe("formatAmount", () => {
  it("uses a dot and two decimals", () => {
    expect(formatAmount(10)).toBe("10.00");
    expect(formatAmount(12.5)).toBe("12.50");
    expect(formatAmount(0.01)).toBe("0.01");
  });

  it("rejects out of range values", () => {
    expect(() => formatAmount(0)).toThrow();
    expect(() => formatAmount(1_000_000_000)).toThrow();
  });
});

describe("toIso88591", () => {
  it("keeps German umlauts and replaces characters outside Latin-1", () => {
    expect(toIso88591("Müller")).toBe("Müller");
    expect(toIso88591("José")).toBe("José");
    expect(toIso88591("你好")).toBe("??");
  });
});

describe("buildEpcPayload", () => {
  it("emits the twelve-field GiroCode with LF separators", () => {
    const payload = buildEpcPayload(sample);
    const lines = payload.split("\n");
    expect(lines).toEqual([
      "BCD",
      "002",
      "2",
      "SCT",
      "BYLADEM1001",
      "Max Mustermann",
      "DE89370400440532013000",
      "EUR25.00",
      "",
      "",
      "Sams Workshop",
    ]);
    expect(payload.includes("\r")).toBe(false);
  });

  it("keeps remittance within 140 characters and maps non-Latin-1 to ?", () => {
    const payload = buildEpcPayload({
      ...sample,
      remittance: `${"x".repeat(139)}€`,
    });
    const remittance = payload.split("\n")[10];
    expect(remittance.length).toBe(140);
    expect(remittance.endsWith("?")).toBe(true);
  });

  it("rejects a bad IBAN", () => {
    expect(() => buildEpcPayload({ ...sample, iban: "not-an-iban" })).toThrow(
      /IBAN/,
    );
  });
});
