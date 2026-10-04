import { describe, expect, it } from "vitest";

import { formatDateRange, formatMonth } from "@app/common/utils/dates";

describe("formatMonth", () => {
  it("shows an ISO month as its name and year", () => {
    expect(formatMonth("2021-09")).toBe("September 2021");
    expect(formatMonth("2019-12")).toBe("December 2019");
    expect(formatMonth("2022-01")).toBe("January 2022");
  });

  // The tests run in a US time zone (vite.config.ts), where the month
  // starts after midnight UTC.
  it("shows the same month in a time zone behind UTC", () => {
    expect(new Date("2021-09").getMonth()).toBe(7); // August, locally
    expect(formatMonth("2021-09")).toBe("September 2021");
  });
});

describe("formatDateRange", () => {
  it("joins the start and end months", () => {
    expect(formatDateRange("2021-04", "2021-09")).toBe(
      "April 2021 – September 2021"
    );
  });

  it("ends Present while ongoing", () => {
    expect(formatDateRange("2021-09", null)).toBe("September 2021 – Present");
  });
});
