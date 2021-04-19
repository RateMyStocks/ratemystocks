/**
 * Represents the JSON response from IEX Cloud API for historical prices.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#intraday-prices}
 */
export interface IexCloudIntradayPriceDto {
  date: string;
  minute: string;
  label: string;
  marketOpen: number;
  marketClose: number;
  marketHigh: number;
  marketLow: number;
  marketAverage: number;
  marketVolume: number;
  marketNotional: number;
  marketNumberOfTrades: number;
  marketChangeOverTime: number;
  high: number;
  low: number;
  open: number;
  close: number;
  average: number;
  volume: number;
  notional: number;
  numberOfTrades: number;
  changeOverTime: number;
}
