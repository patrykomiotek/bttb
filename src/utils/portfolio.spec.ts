import { Portfolio } from "@/types";
import { totalExposure } from "./portfolio";

describe("Portfolio", () => {
  it("should return valid balance", () => {
    const portfolio: Portfolio = {
      balance: 1000,
      currency: "PLN",
      openPositions: [],
    };
    expect(totalExposure(portfolio)).toBe(1000);
  });
});
