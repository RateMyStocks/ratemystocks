/** Range values for stock price charts based off of {@link https://iexcloud.io/docs/api/#historical-prices} */
export const enum StockPriceRange {
  MAX = 'max',
  FIVE_YEAR = '5y',
  TWO_YEAR = '2y',
  ONE_YEAR = ' 1y',
  YEAR_TO_DATE = 'ytd',
  SIX_MONTH = '6m',
  THREE_MONTH = '3m',
  ONE_MONTH = '1m',
  FIVE_DAY = '5d',
  ONE_DAY = '1d',
}
