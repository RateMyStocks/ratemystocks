import { Controller, Get, Param, Query } from '@nestjs/common';
import { IexCloudService } from './iex-cloud.service';
import type {
  IexBatchResponseDto,
  IexCloudHistoricalPriceDto,
  IexCloudIntradayPriceDto,
  IexCloudSearchDto,
  StockPriceRange,
} from '@ratemystocks/api-interface';

/**
 * This controller will forward requests to the IEX Cloud API & return the response back to the client.
 * {@link https://iexcloud.io/docs/api}
 */
@Controller('iex')
export class IexCloudController {
  constructor(private iexCloudService: IexCloudService) {}

  /**
   * Forwards client request to IEX Cloud API's "Batch" endpoint.
   * For one or more stocks symbols, makes request(s) to one or more IEX Cloud endpoints.
   * {@link https://iexcloud.io/docs/api/#batch-requests}
   * @param endpoints The "endpoints" query parameter as a comma-delmited string of IEX Cloud endpoint names.
   * @param symbols The "symbols" query parameter from the request as a comma-delimited string of ticker.
   * @returns Some JSON response based on what IEX Cloud endpoints are being queried.
   */
  @Get('/stocks/batch')
  batchGetStockInfo(
    @Query('endpoints') endpoints: string,
    @Query('symbols') symbols: string
  ): Promise<IexBatchResponseDto> {
    return this.iexCloudService.batchGetStockStats(symbols, endpoints);
  }

  /**
   * Forwards client request to IEX Cloud API's "Search" endpoint.
   * Returns stock info based on ticker symbol or company name if it exists.
   * {@link https://iexcloud.io/docs/api/#search}
   * @param searchText The search input which is expected to be a ticker symbol or company.
   * @returns The IexCloudSearchDto which represents the stock info returned from the search if found.
   */
  @Get('/search/:searchText')
  getStockSearchResults(@Param('searchText') searchText: string): Promise<IexCloudSearchDto> {
    return this.iexCloudService.getStockSearchResults(searchText);
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
  @Get('/stocks/:ticker/chart/:range')
  getStockChartResults(
    @Param('ticker') ticker: string,
    @Param('range') range: StockPriceRange,
    @Query('date') date: string
  ): Promise<IexCloudIntradayPriceDto[] | IexCloudHistoricalPriceDto[]> {
    return this.iexCloudService.getStockChartResults(ticker, range, date);
  }
}
