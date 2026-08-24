// SPDX-License-Identifier: MIT
import { describe, expect, it } from "vitest";
import {
  captionFor,
  donationsWithImages,
  parseCampaign,
  sumDonations,
} from "./live";

const base = {
  updatedAt: "2026-08-14",
  phase: "collecting",
  closeDate: "2026-12-31",
};

describe("parseCampaign", () => {
  it("sums individual donations and treats image plus caption as optional", () => {
    const parsed = parseCampaign({
      ...base,
      collectedEur: 999,
      amountPesos: 1107670.5,
      donations: [
        { date: "2026-08-14", amountEur: 25 },
        {
          date: "2026-08-15",
          amountEur: 10.5,
          image: "/live/updates/crop.webp",
          caption: {
            de: "Zuschnitt",
            en: "Crop",
            pt: "Recorte",
            es: "Recorte",
          },
        },
      ],
    });

    expect(parsed).not.toBeNull();
    expect(parsed?.collectedEur).toBe(35.5);
    expect(parsed?.amountPesos).toBe(1107670.5);
    expect(parsed?.closeDate).toBe("2026-12-31");
    expect(parsed?.donations).toHaveLength(2);
    expect(parsed?.donations[0]).toEqual({ date: "2026-08-14", amountEur: 25 });
    expect(parsed?.donations[1]?.image).toBe("/live/updates/crop.webp");
  });

  it("defaults amountPesos to 0 when missing", () => {
    const parsed = parseCampaign({
      ...base,
      donations: [{ date: "2026-08-14", amountEur: 10 }],
    });
    expect(parsed?.amountPesos).toBe(0);
  });

  it("keeps image-only rows with amountEur 0 out of the euro sum", () => {
    const parsed = parseCampaign({
      ...base,
      amountPesos: 100,
      donations: [
        { date: "2026-08-14", amountEur: 20 },
        {
          date: "2026-08-24",
          amountEur: 0,
          image: "/live/updates/proof.jpg",
        },
      ],
    });
    expect(parsed?.collectedEur).toBe(20);
    expect(parsed?.donations).toHaveLength(2);
    expect(donationsWithImages(parsed!.donations)).toHaveLength(1);
  });

  it("treats omitted amountEur as zero", () => {
    const parsed = parseCampaign({
      ...base,
      donations: [{ date: "2026-08-24", image: "/x.jpg" }],
    });
    expect(parsed?.donations).toEqual([
      { date: "2026-08-24", amountEur: 0, image: "/x.jpg" },
    ]);
  });

  it("still reads the older updates key", () => {
    const parsed = parseCampaign({
      ...base,
      updates: [{ date: "2026-08-14", amountEur: 40 }],
    });
    expect(parsed?.collectedEur).toBe(40);
    expect(parsed?.donations).toHaveLength(1);
  });

  it("skips malformed donation rows", () => {
    const parsed = parseCampaign({
      ...base,
      donations: [
        { date: "2026-08-14", amountEur: 20 },
        { date: "not-a-date", amountEur: 5 },
        { date: "2026-08-15", amountEur: "nope" },
        null,
      ],
    });
    expect(parsed?.donations).toEqual([{ date: "2026-08-14", amountEur: 20 }]);
    expect(parsed?.collectedEur).toBe(20);
  });

  it("returns null without a donation list", () => {
    expect(parseCampaign({ ...base })).toBeNull();
  });

  it("falls back closeDate when missing", () => {
    const parsed = parseCampaign({
      updatedAt: "2026-08-14",
      phase: "collecting",
      donations: [],
    });
    expect(parsed?.closeDate).toBe("2026-12-31");
  });
});

describe("sumDonations", () => {
  it("adds in cents to avoid float drift", () => {
    expect(
      sumDonations([
        { date: "2026-08-14", amountEur: 0.1 },
        { date: "2026-08-14", amountEur: 0.2 },
      ]),
    ).toBe(0.3);
  });
});

describe("captionFor", () => {
  it("falls back to German when the active language is empty", () => {
    expect(captionFor({ de: "Zuschnitt", en: "", pt: "", es: "" }, "en")).toBe(
      "Zuschnitt",
    );
  });
});
