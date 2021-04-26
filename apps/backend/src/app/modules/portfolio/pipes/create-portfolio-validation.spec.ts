import { BadRequestException } from '@nestjs/common';
import { CreatePortfolioDto } from '@ratemystocks/api-interface';
import { CreatePortfolioValidationPipe } from './create-portfolio-validation.pipe';

describe('CreatePortfolioValidationPipe', () => {
  let target: CreatePortfolioValidationPipe;

  describe('transform', () => {
    describe('when validation passes', () => {
      beforeEach(() => {
        target = new CreatePortfolioValidationPipe();
      });

      it('should return the value unchanged if the portfolio to be created has a name and 0 holdings', async () => {
        const portfolio: CreatePortfolioDto = new CreatePortfolioDto();
        portfolio.name = 'Fake Portfolio';
        portfolio.holdings = [];

        expect(await target.transform(portfolio)).toEqual(portfolio);
        expect(await target.transform(portfolio)).toBeInstanceOf(CreatePortfolioDto);
      });

      it('should return the value unchanged if the portfolio has a name and properly weighted holdings', async () => {
        const portfolio = {
          name: 'Fake Portfolio',
          description: null,
          holdings: [
            {
              ticker: 'MSFT',
              weighting: 50,
            },
            {
              ticker: 'GOOG',
              weighting: 50,
            },
          ],
        };

        expect(await target.transform(portfolio)).toEqual(portfolio);
      });
    });

    describe('when validation fails', () => {
      beforeEach(() => {
        target = new CreatePortfolioValidationPipe();
      });

      it('should throw an error if the weightings are greater than 100%', async () => {
        const portfolio = {
          name: 'Fake Portfolio',
          description: null,
          holdings: [
            {
              ticker: 'MSFT',
              weighting: 50.1,
            },
            {
              ticker: 'GOOG',
              weighting: 50,
            },
          ],
        };

        try {
          target.transform(portfolio);
        } catch (err) {
          expect(err).toEqual(
            new BadRequestException(
              'Portfolio holdings are not weighted correctly. Please ensure the weightings add up to 100%.'
            )
          );
        }
      });

      it('should throw an error if the weightings are less than than 100%', async () => {
        const portfolio = {
          name: 'Fake Portfolio',
          description: null,
          holdings: [
            {
              ticker: 'MSFT',
              weighting: 49.1,
            },
            {
              ticker: 'GOOG',
              weighting: 50,
            },
          ],
        };

        try {
          target.transform(portfolio);
        } catch (err) {
          expect(err).toEqual(
            new BadRequestException(
              'Portfolio holdings are not weighted correctly. Please ensure the weightings add up to 100%.'
            )
          );
        }
      });

      it('should throw an error if the portfolio exceeds the max number of holdings', async () => {
        const portfolio = {
          name: 'Fake Portfolio',
          description: null,
          holdings: [
            { ticker: 'MSFT', weighting: 69 },
            { ticker: 'A', weighting: 1 },
            { ticker: 'B', weighting: 1 },
            { ticker: 'C', weighting: 1 },
            { ticker: 'D', weighting: 1 },
            { ticker: 'E', weighting: 1 },
            { ticker: 'F', weighting: 1 },
            { ticker: 'G', weighting: 1 },
            { ticker: 'H', weighting: 1 },
            { ticker: 'I', weighting: 1 },
            { ticker: 'J', weighting: 1 },
            { ticker: 'K', weighting: 1 },
            { ticker: 'L', weighting: 1 },
            { ticker: 'M', weighting: 1 },
            { ticker: 'N', weighting: 1 },
            { ticker: 'O', weighting: 1 },
            { ticker: 'P', weighting: 1 },
            { ticker: 'Q', weighting: 1 },
            { ticker: 'R', weighting: 1 },
            { ticker: 'S', weighting: 1 },
            { ticker: 'T', weighting: 1 },
            { ticker: 'U', weighting: 1 },
            { ticker: 'V', weighting: 1 },
            { ticker: 'W', weighting: 1 },
            { ticker: 'X', weighting: 1 },
            { ticker: 'Y', weighting: 1 },
            { ticker: 'Z', weighting: 1 },
            { ticker: 'AB', weighting: 1 },
            { ticker: 'ABC', weighting: 1 },
            { ticker: 'ABCD', weighting: 1 },
            { ticker: 'ABCDE', weighting: 1 },
            { ticker: 'DEF', weighting: 1 },
          ],
        };

        try {
          target.transform(portfolio);
        } catch (err) {
          expect(err).toEqual(
            new BadRequestException(
              'Currently, we only support 30 stocks per portfolio. Please adjust your holdings accordingly. We are sorry for the inconvenience!'
            )
          );
        }
      });
    });
  });
});
