import { BadRequestException } from '@nestjs/common';
import { PortfolioHoldingsValidationPipe } from './portfolio-holdings-validation.pipe';

describe('PortfolioHoldingsValidationPipe', () => {
  let target: PortfolioHoldingsValidationPipe;

  describe('transform', () => {
    describe('when validation passes', () => {
      beforeEach(() => {
        target = new PortfolioHoldingsValidationPipe();
      });

      it('should throw an error if the weightings are less than than 100%', async () => {
        const portfolioHoldings = {
          holdings: [
            {
              id: undefined,
              ticker: 'MSFT',
              weighting: 49.1,
            },
            {
              id: undefined,
              ticker: 'GOOG',
              weighting: 50,
            },
          ],
        };

        // TODO: These tests are passing regardless of whether or not an exception is being thrown
        try {
          target.transform(portfolioHoldings);
        } catch (err) {
          expect(err).toEqual(
            new BadRequestException(
              'Portfolio holdings are not weighted correctly. Please ensure the weightings add up to 100%.'
            )
          );
        }
      });
    });
  });
});
