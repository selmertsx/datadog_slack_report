import { ProductName } from "./datadog";

/**
 *
 */
export interface ProductReport {
  productName: ProductName;
  exceedHostCount: number;
  plannedHost: number;
}
