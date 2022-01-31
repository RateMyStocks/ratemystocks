import { Country } from '../models/enums/countries.enum';
import { IexCloudCountryValue } from '../models/enums/iex-cloud-country-value.enum';

export class IexCloudCountryToIsoCode {
  /**
   * Formats & abbreviates large numbers.
   */
  static convertIexCloudCountryValueToISOCode(country: IexCloudCountryValue): string {
    switch (country) {
      case IexCloudCountryValue.UNITED_STATES:
        return Country.UnitedStates.toLowerCase();
      case IexCloudCountryValue.CANADA:
        return Country.Canada.toLowerCase();
      case IexCloudCountryValue.CHINA:
        return Country.China.toLowerCase();
      default:
        break;
    }
  }
}
