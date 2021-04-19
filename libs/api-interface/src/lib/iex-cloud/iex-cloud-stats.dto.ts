/**
 * Represents the JSON response from IEX Cloud API for a stats request.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#key-stats}
 */
export class IexCloudStatsDto {
  companyName: string;
  marketcap: number;
  week52high: number;
  week52low: number;
  week52highSplitAdjustOnly: number;
  week52lowSplitAdjustOnly: number;
  week52change: number;
  sharesOutstanding: number;
  float: number;
  avg10Volume: number;
  avg30Volume: number;
  day200MovingAvg: number;
  day50MovingAvg: number;
  employees: number;
  ttmEPS: number;
  ttmDividendRate: number;
  dividendYield: number;
  nextDividendDate: string;
  exDividendDate: string;
  nextEarningsDate: string;
  peRatio: number;
  beta: number;
  maxChangePercent: number;
  year5ChangePercent: number;
  year2ChangePercent: number;
  year1ChangePercent: number;
  ytdChangePercent: number;
  month6ChangePercent: number;
  month3ChangePercent: number;
  month1ChangePercent: number;
  day30ChangePercent: number;
  day5ChangePercent: number;
}
