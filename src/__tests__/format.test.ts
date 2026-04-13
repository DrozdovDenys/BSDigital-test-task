import { describe, it, expect } from "vitest";
import { formatUSD, formatCrypto, formatPercent } from "../utils/format";

describe("formatUSD", () => {
  it("formats positive amounts", () => {
    expect(formatUSD(1234.56)).toBe("$1,234.56");
  });

  it("formats zero", () => {
    expect(formatUSD(0)).toBe("$0.00");
  });

  it("formats negative amounts", () => {
    expect(formatUSD(-500)).toBe("-$500.00");
  });

  it("rounds to 2 decimal places", () => {
    expect(formatUSD(99.999)).toBe("$100.00");
  });
});

describe("formatCrypto", () => {
  it("formats zero", () => {
    expect(formatCrypto(0)).toBe("0");
  });

  it("formats values >= 1 with 4 decimals", () => {
    expect(formatCrypto(1.23456789)).toBe("1.2346");
  });

  it("formats small values with 4 significant figures", () => {
    expect(formatCrypto(0.001234)).toBe("0.001234");
  });
});

describe("formatPercent", () => {
  it("formats positive percent with plus sign", () => {
    expect(formatPercent(3.5)).toBe("+3.50%");
  });

  it("formats negative percent", () => {
    expect(formatPercent(-2.1)).toBe("-2.10%");
  });

  it("formats zero", () => {
    expect(formatPercent(0)).toBe("+0.00%");
  });
});
