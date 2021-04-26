import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Portfolio } from '../../../models/portfolio.entity';
import { PortfolioRepository } from './portfolio.repository';

const mockPortfolioDto = { name: 'Fake Portfolio', holdings: [] };

const mockUserAccount = {
  id: 'a800714b-ab7e-464c-aebd-d8ec17af2fd0',
  username: 'TestUser',
  email: 'testuser@email.com',
  password: 'fakepassword',
};

describe('PortfolioRepository', () => {
  let portfolioRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [PortfolioRepository],
    }).compile();

    portfolioRepository = await module.get<PortfolioRepository>(PortfolioRepository);
  });

  describe('createPortfolio', () => {
    let entity: Portfolio;

    beforeEach(() => {
      entity = new Portfolio();
      portfolioRepository.create = jest.fn().mockReturnValue(entity);
    });

    it('successfully creates a new portfolio', () => {
      jest.spyOn(entity, 'save').mockResolvedValue(undefined);
      expect(portfolioRepository.createPortfolio(mockPortfolioDto, mockUserAccount)).resolves.not.toThrow();
    });

    it('throws a conflict exception if the portfolio name already exists', async () => {
      jest.spyOn(entity, 'save').mockRejectedValue({ code: '23505' });

      // TODO: Figure out why the line below always passes. Until then, use the more verbose try/catch
      // expect(portfolioRepository.createPortfolio(mockPortfolioDto, mockUserAccount)).rejects.toThrow(ConflictException);

      try {
        await portfolioRepository.createPortfolio(mockPortfolioDto, mockUserAccount);
      } catch (err) {
        expect(err).toEqual(
          new ConflictException(
            'You have already created a portfolio with this name. Please use a different name to continue.'
          )
        );
      }
    });

    it('throws a generic 500 Internal Server Error exception for any other unexpected error', async () => {
      jest.spyOn(entity, 'save').mockRejectedValue({ code: '12345' }); // unhandled error code

      // TODO: Figure out why this line below ALWAYS passes even when it should fail. Until then, use the more verbose try/catch
      // expect(portfolioRepository.createPortfolio(mockPortfolioDto, mockUserAccount)).rejects.toThrow(InternalServerErrorException);

      try {
        await portfolioRepository.createPortfolio(mockPortfolioDto, mockUserAccount);
      } catch (err) {
        expect(err).toEqual(new InternalServerErrorException());
      }
    });
  });
});
