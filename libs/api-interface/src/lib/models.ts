import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Matches,
  Min,
  MinLength,
  IsOptional,
} from 'class-validator';
import {
  USERNAME_REGEX,
  USERNAME_VALIDATION_MESSAGE,
  EMAIL_REGEX,
  EMAIL_VALIDATION_MESSAGE,
  PASSWORD_REGEX,
  PASSWORD_VALIDATION_MESSAGE,
} from '@ratemystocks/regex-patterns';

// TODO: Standarize using interfaces rather than classes
// TODO: Split each API interface into its own library

///////////////////////////////////////////
//                AUTH                   //
//////////////////////////////////////////

/**
 * Incoming DTO for a user signing in or signing up
 */
export class AuthCredentialDto {
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  @Matches(USERNAME_REGEX, { message: USERNAME_VALIDATION_MESSAGE })
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(PASSWORD_REGEX, { message: PASSWORD_VALIDATION_MESSAGE })
  password: string;
}

export class SignUpDto extends AuthCredentialDto {
  @IsString()
  @Matches(EMAIL_REGEX, { message: EMAIL_VALIDATION_MESSAGE })
  email: string;
}

export interface SignInResponseDto {
  accessToken: string;
  expiresIn: number;
  userId: string;
  username: string;
  spiritAnimal: SpiritAnimal;
}

export enum UserRole {
  ADMIN,
  REGULAR,
}

/** Preset Spirit Animals that map to User Avatar images of the same name */
export enum SpiritAnimal {
  ANTELOPE = 'antelope',
  ARCTIC_WOLF = 'arctic-wolf',
  BABY_FOX = 'baby-fox',
  BEAVER = 'beaver',
  BOAR = 'boar',
  BULL = 'bull',
  BULLDOG = 'bulldog',
  BUNNY = 'bunny',
  CAMEL = 'camel',
  CAT = 'cat',
  CHICKEN = 'chicken',
  CHIMPANZEE = 'chimpanzee',
  CHIPMUNK = 'chipmunk',
  COBRA = 'cobra',
  COW = 'cow',
  DEER = 'deer',
  DONKEY = 'donkey',
  ELEPHANT = 'elephant',
  FOX = 'fox',
  FOXFOUND = 'foxhound',
  GERBIL = 'gerbil',
  GIRAFFE = 'giraffe',
  GOAT = 'goat',
  GOLDFISH = 'goldfish',
  GOOSE = 'goose',
  GREYHOUND = 'greyhound',
  HAMSTER = 'hamster',
  HARE = 'hare',
  HEN = 'hen',
  HIPPO = 'hippo',
  KOALA = 'koala',
  LAMB = 'lamb',
  LION = 'lion',
  MACAQUE = 'macaque',
  MONKEY = 'monkey',
  MOUSE = 'mouse',
  OSTRICH = 'ostrich',
  PANDA = 'panda',
  PENGUIN = 'penguin',
  PIG = 'pig',
  POLAR_BEAR = 'polar-bear',
  POODLE = 'poodle',
  RABBIT = 'rabbit',
  RED_PANDA = 'red-panda',
  RHINO = 'rhino',
  TIGER = 'tiger',
  WESTIE = 'westie',
  WOLF = 'wolf',
}

///////////////////////////////////////////
//                USER                   //
//////////////////////////////////////////

export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  spiritAnimal: SpiritAnimal;
}

///////////////////////////////////////////
//                IEX                    //
//////////////////////////////////////////

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

/**
 * Represents the JSON response from IEX Cloud API for historical prices.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#historical-prices}
 */
export interface IexCloudHistoricalPriceDto {
  close: number;
  high: number;
  low: number;
  open: number;
  symbol: string;
  volume: number;
  id: string;
  key: string;
  subkey: string;
  date: string;
  updated: number;
  changeOverTime: number;
  marketChangeOverTime: number;
  uOpen: number;
  uClose: number;
  uHigh: number;
  uLow: number;
  uVolume: number;
  fOpen: number;
  fClose: number;
  fHigh: number;
  fLow: number;
  fVolume: number;
  label: string;
  change: number;
  changePercent: number;
}

/**
 * Represents the JSON response from IEX Cloud API for historical prices.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#intraday-prices}
 */
export interface IexCloudIntradayPriceDto {
  date: string;
  minute: string;
  label: string;
  marketOpen: number;
  marketClose: number;
  marketHigh: number;
  marketLow: number;
  marketAverage: number;
  marketVolume: number;
  marketNotional: number;
  marketNumberOfTrades: number;
  marketChangeOverTime: number;
  high: number;
  low: number;
  open: number;
  close: number;
  average: number;
  volume: number;
  notional: number;
  numberOfTrades: number;
  changeOverTime: number;
}

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

export enum IexCloudSecurityType {
  ad = 'ADR', // ADR
  cs = 'Stock', // Common Stock
  cef = 'Closed End Fund', // Closed End Fund
  et = 'ETF', // ETF
  oef = 'Open Ended Fund', // Open Ended Fund
  ps = 'Preferred Stock', // Preferred Stock
  rt = 'Right', // Right
  struct = 'Structured Product', // Structured Product
  ut = 'Unit', // Unit
  wi = 'When Issued', // When Issued
  wt = 'Warrant', // Warrant
}

/**
 * Represents the JSON response from IEX Cloud API for a stats request.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#key-stats}
 */
export class IexCloudStatsDto {
  companyName: string;
  marketcap: number;
  week52high: number;
  week52low: number;
  week52highSplitAdjustOnly: number;
  week52lowSplitAdjustOnly: number;
  week52change: number;
  sharesOutstanding: number;
  float: number;
  avg10Volume: number;
  avg30Volume: number;
  day200MovingAvg: number;
  day50MovingAvg: number;
  employees: number;
  ttmEPS: number;
  ttmDividendRate: number;
  dividendYield: number;
  nextDividendDate: string;
  exDividendDate: string;
  nextEarningsDate: string;
  peRatio: number;
  beta: number;
  maxChangePercent: number;
  year5ChangePercent: number;
  year2ChangePercent: number;
  year1ChangePercent: number;
  ytdChangePercent: number;
  month6ChangePercent: number;
  month3ChangePercent: number;
  month1ChangePercent: number;
  day30ChangePercent: number;
  day5ChangePercent: number;
}

export class IexCloudQuoteDto {
  symbol: string;
  companyName: string;
  primaryExchange: string;
  calculationPrice: string;
  open: number;
  openTime: number;
  openSource: string;
  close: number;
  closeTime: number;
  closeSource: string;
  high: number;
  highTime: number;
  highSource: string;
  low: number;
  lowTime: number;
  lowSource: string;
  latestPrice: number;
  latestSource: string;
  latestTime: string;
  latestUpdate: number;
  latestVolume: number;
  iexRealtimePrice: number;
  iexRealtimeSize: number;
  iexLastUpdated: number;
  delayedPrice: number;
  delayedPriceTime: number;
  oddLotDelayedPrice: number;
  oddLotDelayedPriceTime: number;
  extendedPrice: number;
  extendedChange: number;
  extendedChangePercent: number;
  extendedPriceTime: number;
  previousClose: number;
  previousVolume: number;
  change: number;
  changePercent: number;
  volume: number;
  iexMarketPercent: number;
  iexVolume: number;
  avgTotalVolume: number;
  iexBidPrice: number;
  iexBidSize: number;
  iexAskPrice: number;
  iexAskSize: number;
  iexOpen: number;
  iexOpenTime: number;
  iexClose: number;
  iexCloseTime: number;
  marketCap: number;
  peRatio: number;
  week52High: number;
  week52Low: number;
  ytdChange: number;
  lastTradeTime: number;
  isUSMarketOpen: false;
}

/**
 * Represents the "data" object from IEX Cloud API response for a single stock batch request to multiple /stock endpoints.
 * Currently only contains the data from "Company", "News", & "Stats" endpoints from IEX Cloud.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#batch-requests}
 */
export class IexCloudStockDataDto {
  stats: IexCloudStatsDto;
  company: IexCloudCompanyDto;
  // news: IexCloudNewsDto;
  quote: IexCloudQuoteDto;
}

/**
 * Represents the JSON response from IEX Cloud API for a single stock batch request to multiple /stock endpoints.
 * Currently, only contains data from the "Company", "News", & "Stats" endpoints from IEX Cloud.
 * Refer to their documentation for field descriptions.
 * {@link https://iexcloud.io/docs/api/#batch-requests}
 */
export class IexCloudStockInfoDto {
  data: IexCloudStockDataDto;
}

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

///////////////////////////////////////////
//                PORTFOLIO              //
//////////////////////////////////////////

export class CreatePortfolioRatingDto {
  id: string;
  isLiked: boolean;
}

export interface PortfolioDto {
  id: string;
  name: string;
  description: string;
  dateCreated: string;
  lastUpdated: string;
  stocks: PortfolioStockDto[]; // This may be null or empty array depending on the API call
  user: {
    id: string;
    username: string;
    email: string;
    // TODO: Add spirit animal
  };
}

/**
 * DTO representing a Portfolio object with minimal data needed to be created.
 * @param name The name of the portfolio.
 * @param description The optional description of the portfolio.
 * @param holdings The array of stock DTOs the portfolio will have.
 */
export class CreatePortfolioDto {
  @IsNotEmpty()
  @MaxLength(40)
  name: string;

  @MaxLength(500)
  description: string;

  @MaxLength(30)
  holdings: CreatePortfolioStockDto[];
}

export class ListPortfoliosDto {
  items: {
    id: string;
    name: string;
    largest_holding: string;
    username: string;
    spirit_animal: SpiritAnimal;
    num_likes: number;
    num_dislikes: number;
    last_updated: string;
    num_holdings: number;
  }[];
  totalCount: number;
}

export class UserPortfolioDto {
  id: string;
  name: string;
  num_likes: number;
  num_dislikes: number;
  largest_holding: string;
  last_updated: string;
  num_holdings: number;
}

export class PortfolioRatingCountsDto {
  likes: number;
  dislikes: number;
}

// TODO: rename to CreateOrUpdatePortfolioStockDto
// TODO: Delete this and just use PortfolioStockDto?
export class CreatePortfolioStockDto {
  @IsOptional()
  id: string;

  @IsNotEmpty()
  @MaxLength(5)
  ticker: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Min(0)
  @Max(100)
  weighting: number;
}

export interface PortfolioStockDto {
  id: string;
  ticker: string;
  weighting: number;
  portfolioId: string;
}

export interface PortfolioRatingDto {
  id: string;
  userId: string;
  portfolioId: string;
  isLiked: boolean;
  lastUpdated: Date;
}

///////////////////////////////////////////
//                STOCKS                 //
/////////////////////////////////////////

export class StockRatingAggregation {
  ticker: string;
  sell_count: number;
  buy_count: number;
  hold_count: number;
}

/**
 * Dto for the number of buy/hold/sell ratings for a stock
 */
export class StockRatingCountDto {
  buy: number;
  hold: number;
  sell: number;
}

export interface StockRatingListDto {
  items: StockRatingAggregation[];
  totalCount: number;
}

// export const enum StockRatingEnum {
//   BUY = 'buy',
//   HOLD = 'hold',
//   SELL = 'sell',
// }

export class StockRatingDto {
  // TODO: Set this to the enum
  stockRating: any;
}
