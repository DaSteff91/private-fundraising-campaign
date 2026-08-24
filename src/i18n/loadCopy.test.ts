// SPDX-License-Identifier: MIT
import { describe, expect, it } from "vitest";
import { de } from "./de";
import { isCopyShape } from "./loadCopy";

describe("isCopyShape", () => {
  it("accepts bundled German copy", () => {
    expect(isCopyShape(de)).toBe(true);
  });

  it("rejects incomplete payloads", () => {
    expect(isCopyShape(null)).toBe(false);
    expect(isCopyShape({ meta: { title: "x" } })).toBe(false);
  });
});
