import { IexCloudSecurityType } from './iex-cloud-security-type.enum';

/**
 * Represents the JSON response from IEX Cloud API for a stock search request.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#search}
 */
export class IexCloudSearchDto {
  symbol: string;
  cik: string;
  securityName: string;
  securityType: IexCloudSecurityType;
  region: string;
  exchange: string;
  sector: string;
}
