import { IexCloudCompanyDto } from './iex-cloud-company.dto';
import { IexCloudNewsDto } from './iex-cloud-news.dto';
import { IexCloudStatsDto } from './iex-cloud-stats.dto';

/**
 * Represents the "data" object from IEX Cloud API response for a single stock batch request to multiple /stock endpoints.
 * Currently only contains the data from "Company", "News", & "Stats" endpoints from IEX Cloud.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#batch-requests}
 */
export class IexCloudStockDataDto {
  stats: IexCloudStatsDto;
  company: IexCloudCompanyDto;
  news: IexCloudNewsDto;
}
