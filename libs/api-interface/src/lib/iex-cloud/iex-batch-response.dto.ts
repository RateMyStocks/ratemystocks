/**
 * Represents the JSON response from IEX Cloud API for a batch stock request.
 * The response will vary based on the number of ticker symbols request, and number of IEX Cloud endpoints requested.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#batch-requests}
 */
export interface IexBatchResponseDto {
  [ticker: string]: StockEndpoints;
}

interface StockEndpoints {
  [endpoint: string]: StockEndpointData;
}

interface StockEndpointData {
  [field: string]: unknown;
}
