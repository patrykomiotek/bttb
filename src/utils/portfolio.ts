// import { Portfolio } from '../types/index.ts'
import { Portfolio } from "../types";

// function totalExposure(portfolio: Portfolio): number {
export function totalExposure(portfolio: Portfolio) {
  return portfolio.balance;
}
