// SPDX-License-Identifier: MIT
import { describe, expect, it } from "vitest";
import { paypalMeBaseUrl, paypalMeHandle, paypalMeUrl } from "./paypal";

describe("paypalMeHandle", () => {
  it("keeps a plain alphanumeric handle", () => {
    expect(paypalMeHandle("ExampleUser")).toBe("ExampleUser");
  });

  it("strips pasted paypal.me and paypal.com URLs including amount", () => {
    expect(paypalMeHandle("https://paypal.me/ExampleUser")).toBe("ExampleUser");
    expect(paypalMeHandle("https://www.paypal.me/ExampleUser/25EUR")).toBe("ExampleUser");
    expect(paypalMeHandle("https://www.paypal.com/paypalme/ExampleUser/25.00EUR")).toBe(
      "ExampleUser",
    );
    expect(paypalMeHandle("paypal.me/ExampleUser")).toBe("ExampleUser");
  });

  it("rejects empty, too long, or non-alphanumeric handles", () => {
    expect(() => paypalMeHandle("")).toThrow(/required/);
    expect(() => paypalMeHandle("   ")).toThrow(/required/);
    expect(() => paypalMeHandle("has-dash")).toThrow(/Invalid/);
    expect(() => paypalMeHandle("a".repeat(21))).toThrow(/Invalid/);
  });
});

describe("paypalMeUrl", () => {
  it("appends a dotted euro amount and EUR", () => {
    expect(paypalMeUrl("ExampleUser", 25)).toBe(
      "https://www.paypal.com/paypalme/ExampleUser/25.00EUR",
    );
    expect(paypalMeUrl("https://paypal.me/ExampleUser", 12.5)).toBe(
      "https://www.paypal.com/paypalme/ExampleUser/12.50EUR",
    );
  });

  it("builds a noscript URL without an amount", () => {
    expect(paypalMeBaseUrl("ExampleUser")).toBe("https://www.paypal.com/paypalme/ExampleUser");
  });

  it("rejects out of range amounts via formatAmount", () => {
    expect(() => paypalMeUrl("ExampleUser", 0)).toThrow();
  });
});
