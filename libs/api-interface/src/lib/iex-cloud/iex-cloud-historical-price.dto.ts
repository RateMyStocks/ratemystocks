/**
 * Represents the JSON response from IEX Cloud API for historical prices.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#historical-prices}
 */
export interface IexCloudHistoricalPriceDto {
  close: number;
  high: number;
  low: number;
  open: number;
  symbol: string;
  volume: number;
  id: string;
  key: string;
  subkey: string;
  date: string;
  updated: number;
  changeOverTime: number;
  marketChangeOverTime: number;
  uOpen: number;
  uClose: number;
  uHigh: number;
  uLow: number;
  uVolume: number;
  fOpen: number;
  fClose: number;
  fHigh: number;
  fLow: number;
  fVolume: number;
  label: string;
  change: number;
  changePercent: number;
}
