export interface StockUpcomingEventDto {
  [ticker: string]: {
    'upcoming-events': {
      dividends: { symbol: string; reportDate: string }[];
      earnings: { symbol: string; reportDate: string }[];
      splits: { symbol: string; reportDate: string }[];
    };
  };
}
