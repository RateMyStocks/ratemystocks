import { IexCloudSecurityType } from './iex-cloud-security-type.enum';

/**
 * Represents the JSON response from IEX Cloud API for a company request.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#company}
 */
export class IexCloudCompanyDto {
  symbol: string;
  companyName: string;
  exchange: string;
  industry: string;
  website: string;
  description: string;
  CEO: string;
  securityName: string;
  issueType: IexCloudSecurityType;
  sector: string;
  primarySicCode: string;
  employees: number;
  tags: string[];
  address: string;
  address2: string;
  state: string;
  city: string;
  zip: string;
  country: string;
  phone: string;
}
