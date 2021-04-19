import { IexCloudStockDataDto } from './iex-cloud-stock-info-data.dto';

/**
 * Represents the JSON response from IEX Cloud API for a single stock batch request to multiple /stock endpoints.
 * Currently, only contains data from the "Company", "News", & "Stats" endpoints from IEX Cloud.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#batch-requests}
 */
export class IexCloudStockInfoDto {
  data: IexCloudStockDataDto;
}
