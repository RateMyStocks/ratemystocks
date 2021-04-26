import { BadRequestException, PipeTransform } from '@nestjs/common';
import { CreatePortfolioDto, PortfolioStockDto } from '@ratemystocks/api-interface';

const MAX_STOCKS = 30;

export class CreatePortfolioValidationPipe implements PipeTransform {
  transform(portfolio: CreatePortfolioDto) {
    if (portfolio.name.length === 0) {
      throw new BadRequestException('Portfolio must have a name.');
    }

    if (portfolio.holdings.length > 0 && !this.isWeightingValid(portfolio.holdings)) {
      throw new BadRequestException(
        'Portfolio holdings are not weighted correctly. Please ensure the weightings add up to 100%.'
      );
    }

    if (portfolio.holdings.length > MAX_STOCKS) {
      throw new BadRequestException(
        `Currently, we only support ${MAX_STOCKS} stocks per portfolio. Please adjust your holdings accordingly. We are sorry for the inconvenience!`
      );
    }

    return portfolio;
  }

  /**
   * Validates the holdings of a Portfolio to ensure the weightings add up to 100%.
   * @param dto The CreatePortfolioDto whose stock holdings will be validated.
   * @return True if the sum of all stock weightings in a portfolio add up to 100%, false otherwise.
   */
  private isWeightingValid(holdings: PortfolioStockDto[]): boolean {
    const weightingTotal = holdings.reduce((accumulator: number, portfolioStock: PortfolioStockDto) => {
      return accumulator + portfolioStock.weighting;
    }, 0);

    return weightingTotal === 100;
  }
}
