/**
 * The 'country' field of the IEX Cloud API is returned in an inconsistent format. Sometimes it is a country code, sometimes it is the name of the country.
 */
export enum IexCloudCountryValue {
  UNITED_STATES = 'US',
  CANADA = 'Canada',
  CHINA = 'China (Mainland)',
}
