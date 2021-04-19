/**
 * Represents the JSON response from IEX Cloud API for a news request.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#news}
 */
export class IexCloudNewsDto {
  datetime: number;
  headline: string;
  source: string;
  url: string;
  summary: string;
  related: string;
  image: string;
  lang: string;
  hasPaywall: boolean;
}
