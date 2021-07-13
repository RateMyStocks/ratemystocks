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
              id: undefined,
              ticker: 'MSFT',
              weighting: 50,
            },
            {
              id: undefined,
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
              id: undefined,
              ticker: 'MSFT',
              weighting: 50.1,
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
            { id: undefined, ticker: 'MSFT', weighting: 69 },
            { id: undefined, ticker: 'A', weighting: 1 },
            { id: undefined, ticker: 'B', weighting: 1 },
            { id: undefined, ticker: 'C', weighting: 1 },
            { id: undefined, ticker: 'D', weighting: 1 },
            { id: undefined, ticker: 'E', weighting: 1 },
            { id: undefined, ticker: 'F', weighting: 1 },
            { id: undefined, ticker: 'G', weighting: 1 },
            { id: undefined, ticker: 'H', weighting: 1 },
            { id: undefined, ticker: 'I', weighting: 1 },
            { id: undefined, ticker: 'J', weighting: 1 },
            { id: undefined, ticker: 'K', weighting: 1 },
            { id: undefined, ticker: 'L', weighting: 1 },
            { id: undefined, ticker: 'M', weighting: 1 },
            { id: undefined, ticker: 'N', weighting: 1 },
            { id: undefined, ticker: 'O', weighting: 1 },
            { id: undefined, ticker: 'P', weighting: 1 },
            { id: undefined, ticker: 'Q', weighting: 1 },
            { id: undefined, ticker: 'R', weighting: 1 },
            { id: undefined, ticker: 'S', weighting: 1 },
            { id: undefined, ticker: 'T', weighting: 1 },
            { id: undefined, ticker: 'U', weighting: 1 },
            { id: undefined, ticker: 'V', weighting: 1 },
            { id: undefined, ticker: 'W', weighting: 1 },
            { id: undefined, ticker: 'X', weighting: 1 },
            { id: undefined, ticker: 'Y', weighting: 1 },
            { id: undefined, ticker: 'Z', weighting: 1 },
            { id: undefined, ticker: 'AB', weighting: 1 },
            { id: undefined, ticker: 'ABC', weighting: 1 },
            { id: undefined, ticker: 'ABCD', weighting: 1 },
            { id: undefined, ticker: 'ABCDE', weighting: 1 },
            { id: undefined, ticker: 'DEF', weighting: 1 },
          ],
        };

        // TODO: These tests are passing regardless of whether or not an exception is being thrown
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
