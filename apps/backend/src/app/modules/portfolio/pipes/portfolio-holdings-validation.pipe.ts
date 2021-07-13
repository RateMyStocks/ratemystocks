import { PipeTransform, BadRequestException } from '@nestjs/common';
import { CreatePortfolioStockDto } from '@ratemystocks/api-interface';

export class PortfolioHoldingsValidationPipe implements PipeTransform {
  transform(portfolioHoldings: { holdings: CreatePortfolioStockDto[] }) {
    if (portfolioHoldings.holdings.length > 0 && !this.isWeightingValid(portfolioHoldings.holdings)) {
      throw new BadRequestException(
        'Portfolio holdings are not weighted correctly. Please ensure the weightings add up to 100%.'
      );
    }

    return portfolioHoldings;
  }

  /**
   * Validates the holdings of a Portfolio to ensure the weightings add up to 100%.
   * @param dto The CreatePortfolioDto whose stock holdings will be validated.
   * @return True if the sum of all stock weightings in a portfolio add up to 100%, false otherwise.
   */
  private isWeightingValid(holdings: CreatePortfolioStockDto[]): boolean {
    const weightingTotal = holdings.reduce((accumulator: number, portfolioStock: CreatePortfolioStockDto) => {
      return accumulator + portfolioStock.weighting;
    }, 0);

    return weightingTotal === 100;
  }
}
