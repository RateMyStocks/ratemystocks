import { Injectable, HttpService } from '@nestjs/common';
import {
  IexCloudHistoricalPriceDto,
  IexCloudIntradayPriceDto,
  IexCloudSearchDto,
  IexCloudStockDataDto,
  IexCloudStockInfoDto,
  StockPriceRange,
  StockUpcomingEventDto,
} from '@ratemystocks/api-interface';

require('dotenv').config();

/**
 * Service that will be used to forward requests to the IEX Cloud API.
 * {@link https://iexcloud.io/docs/api}
 */
@Injectable()
export class IexCloudService {
  constructor(private readonly httpService: HttpService) {}

  /**
   * Calls IEX Cloud API to get an array of stocks up to the top 10 matches. Results are sorted for relevancy.
   * {@link https://iexcloud.io/docs/api/#search}
   * @param input The text to search by which should be the stock ticker symbol or company name
   * @return The IexCloudSearchDto object representing the IEX Cloud API response.
   */
  async getStockSearchResults(input: string): Promise<IexCloudSearchDto> {
    const stockSearchResults = await this.httpService.get(`/search/${input}`).toPromise();
    return stockSearchResults.data;
  }

  /**
   * For a single stock, makes a batch request to the "Stats", "Company", & "News" IEX Cloud endpoints.
   * @param ticker The ticker symbol to make a batch request to multiple endpoints for.
   * @returns The IexCloudStockInfoDataDto object containing the stats, company, and news data fro a stock.
   */
  async getStockData(ticker: string): Promise<IexCloudStockDataDto> {
    const stockInfo: IexCloudStockInfoDto = await this.httpService
      .get(`/stock/${ticker}/batch?types=stats,company,quote,news`)
      .toPromise();
    const stockData: IexCloudStockDataDto = stockInfo.data;
    return stockData;
  }

  /**
   * Makes a batch request to IEX Cloud for multiple stocks and to multiple IEX /stock endpoints.
   * {@link https://iexcloud.io/docs/api/#batch-requests}
   * @param tickerSymbols A comma delimited list of stock ticker symbols from the controller endpoints query params.
   * @param iexEndpoints A comma delimited list of IEX Cloud API endpoints.
   * @return The IEX Cloud API response for a batch request wrapped in a Promise.
   *         See the IEX Cloud API documentation for an example of the response format.
   */
  async batchGetStockStats(tickerSymbols: string, iexEndpoints: string): Promise<any> {
    const stockStats = await this.httpService
      .get(`/stock/market/batch?symbols=${tickerSymbols}&types=${iexEndpoints}`)
      .toPromise();

    return stockStats.data;
  }

  /**
   * Calls IEX cloud to get either the intraday or historical prices depending on the range i.e. 1d, 5d, 1m,...
   * {@link https://iexcloud.io/docs/api/#historical-prices}
   * {@link https://iexcloud.io/docs/api/#intraday-prices}
   * @param ticker The stock ticker symbol to get stock prices for.
   * @param range An enum indicating how far back to get stock prices for i.e. 1d, 5d, 1m, etc.
   * @param date Specifies the exact date to get prices for.
   * @return The response from the IEX Cloud API, so either a list of intraday prices or historical prices for a stock.
   */
  async getStockChartResults(
    ticker: string,
    range: StockPriceRange,
    date: string
  ): Promise<IexCloudIntradayPriceDto[] | IexCloudHistoricalPriceDto[]> {
    let chartEndpoint;
    if (range === StockPriceRange.ONE_DAY) {
      chartEndpoint = `/stock/${ticker}/intraday-prices`;
    } else {
      chartEndpoint = `/stock/${ticker}/chart/${range}`;
      if (date) {
        chartEndpoint += `/${date}`;
      }
    }
    const stockChartResults = await this.httpService.get(chartEndpoint).toPromise();
    return stockChartResults.data;
  }

  /**
   * Returns the upcoming event dates for a set of stocks.
   * @param tickers A comma delimited list of ticker symbols.
   * @returns An object containing ticker symbols mapped to that stock's upcoming event dates.
   */
  async getStockUpcomingEvents(tickers: string): Promise<StockUpcomingEventDto> {
    const stockUpcomingEvents = await this.httpService
      .get(`/stock/market/batch?symbols=${tickers}&types=upcoming-events`)
      .toPromise();

    return stockUpcomingEvents.data;
  }
}
