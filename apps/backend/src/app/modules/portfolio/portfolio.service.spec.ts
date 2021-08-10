import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PortfolioRepository } from './portfolio.repository';
import { PortfolioService } from './portfolio.service';
import { PortfolioStockRepository } from './portfolio-stock.repository';
import { PortfolioRatingRepository } from './portfolio-rating.repository';
import { UserAccount } from '../../../models/userAccount.entity';
import { Portfolio } from '../../../models/portfolio.entity';
import { PortfolioStock } from '../../../models/portfolioStock.entity';
import { CreatePortfolioDto, CreatePortfolioRatingDto } from '@ratemystocks/api-interface';
import { PortfolioRating } from '../../../models/portfolioRating.entity';

const mockUserAccount: UserAccount = new UserAccount();
mockUserAccount.id = 'a800714b-ab7e-464c-aebd-d8ec17af2fd0';
mockUserAccount.username = 'TestUser';
mockUserAccount.email = 'testuser@email.com';
mockUserAccount.password = 'fakepassword';

const mockPortfolioRepository = () => ({
  createPortfolio: jest.fn(),
  findOne: jest.fn(),
});

const mockPortfolioRatingRepository = () => ({
  count: jest
    .fn()
    // In the service, usually the first call to PortfolioRatingRepository.count is for likes, 2nd is for dislikes
    .mockImplementationOnce(() => 32) // likes
    .mockImplementationOnce(() => 1), // dislikes,
  findOne: jest.fn(),
  createOrUpdatePortfolioRating: jest.fn(),
  delete: jest.fn(),
});

const mockPortfolioStockRepository = () => ({
  find: jest.fn(),
});

describe('PortfolioService', () => {
  let service: PortfolioService;
  let repository: PortfolioRepository;
  let portfolioRatingRepository: PortfolioRatingRepository;
  let portfolioStockRepository: PortfolioStockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PortfolioService,
        { provide: PortfolioRepository, useFactory: mockPortfolioRepository },
        { provide: PortfolioRatingRepository, useFactory: mockPortfolioRatingRepository },
        { provide: PortfolioStockRepository, useFactory: mockPortfolioStockRepository },
      ],
    }).compile();

    service = module.get<PortfolioService>(PortfolioService);
    repository = module.get<PortfolioRepository>(PortfolioRepository);
    portfolioRatingRepository = module.get<PortfolioRatingRepository>(PortfolioRatingRepository);
    portfolioStockRepository = module.get<PortfolioStockRepository>(PortfolioStockRepository);
  });

  describe('getPortfolioById', () => {
    it('calls portfolioRepository.findOne() and retrieve a portfolio by uuid', async () => {
      const mockPortfolio: Portfolio = new Portfolio();
      mockPortfolio.id = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
      mockPortfolio.name = 'Fake Portfolio';
      mockPortfolio.user = new UserAccount();
      mockPortfolio.user.password = 'fakepasswordhash';
      mockPortfolio.user.salt = 'fakepasswordsalt';
      mockPortfolio.user.email = 'fakeemail@gmail.com';

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPortfolio);

      const result: Portfolio = await service.getPortfolioById(mockPortfolio.id);

      expect(result).toEqual(mockPortfolio);

      expect(repository.findOne).toHaveBeenCalledWith(mockPortfolio.id);
    });

    it('throw a Not Found exception if the Portfolio does not exist', () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      expect(service.getPortfolioById('someid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getPortfolioStocks', () => {
    it('should return stocks belonging to a portfolio', async () => {
      const mockPortfolio: Portfolio = new Portfolio();
      mockPortfolio.id = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
      mockPortfolio.name = 'Fake Portfolio';

      const mockPortfolioStock: PortfolioStock = new PortfolioStock();
      mockPortfolioStock.id = 'ea15bfab-b2ca-47e2-8879-0091c1f1caf7';
      mockPortfolioStock.ticker = 'MMM';
      mockPortfolioStock.weighting = 100.0;
      mockPortfolioStock.portfolio = mockPortfolio;
      mockPortfolioStock.portfolioId = mockPortfolio.id;

      jest.spyOn(portfolioStockRepository, 'find').mockResolvedValue([mockPortfolioStock]);

      const result: PortfolioStock[] = await service.getPortfolioStocks(mockPortfolio.id);

      expect(result).toEqual([mockPortfolioStock]);
      expect(result[0].portfolio).toBeFalsy();
      expect(portfolioStockRepository.find).toHaveBeenCalledWith({ where: { portfolioId: mockPortfolio.id } });
    });
  });

  describe('createPortfolio', () => {
    it('calls portfolioRepository.createPortfolio() and returns the result', async () => {
      const mockPortfolio: Portfolio = new Portfolio();
      mockPortfolio.id = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
      mockPortfolio.name = 'Fake Portfolio';
      mockPortfolio.description = 'Fake Description';

      jest.spyOn(repository, 'createPortfolio').mockResolvedValue(mockPortfolio);

      const portfolioDto = new CreatePortfolioDto();
      portfolioDto.name = mockPortfolio.name;
      portfolioDto.description = mockPortfolio.description;

      const result = await service.createPortfolio(portfolioDto, mockUserAccount);
      expect(repository.createPortfolio).toHaveBeenCalledWith(portfolioDto, mockUserAccount);
      expect(result).toEqual(mockPortfolio);
    });
  });

  describe('updatePortfolioName', () => {
    it('calls portfolioRepository.save() and returns the updated portfolio', async () => {
      const mockPortfolio: Portfolio = new Portfolio();
      mockPortfolio.id = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
      mockPortfolio.name = 'Fake Portfolio';
      mockPortfolio.user = mockUserAccount;

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockPortfolio);

      // Mock the Task entity's "save" method to return anything. It doesn't matter for this test since we are not returning the result of save
      const saveSpy = jest.spyOn(mockPortfolio, 'save').mockResolvedValue(new Portfolio());

      const result = await service.updatePortfolioName(mockUserAccount, mockPortfolio.id, {
        name: 'Updated Portfolio Name',
      });

      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: mockPortfolio.id, userId: mockUserAccount.id } });
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(result.id).toEqual(mockPortfolio.id);
      expect(result.user.id).toEqual(mockPortfolio.user.id);
      expect(result.name).toEqual('Updated Portfolio Name');

      // Excludes sensitive & unnecessary user info from the returned portfolio entity
      expect(result.user.password).toBeFalsy();
      expect(result.user.email).toBeFalsy();
      expect(result.user.salt).toBeFalsy();
    });

    it('returns 403 if a user attempts to update a portfolio they do not own (portfolio cant be found with userId & portfolioId)', async () => {
      const mockPortfolio: Portfolio = new Portfolio();
      mockPortfolio.id = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
      mockPortfolio.name = 'Fake Portfolio';
      mockPortfolio.user = mockUserAccount;

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      try {
        await service.updatePortfolioName(mockUserAccount, '0319fa3a-19b9-4892-a54d-03d4d74e3cc4', {
          name: 'Updated Portfolio Name',
        });
      } catch (err) {
        expect(err).toEqual(new ForbiddenException('You do not own this portfolio.'));
      }

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: '0319fa3a-19b9-4892-a54d-03d4d74e3cc4', userId: mockUserAccount.id },
      });
    });
  });

  describe('getPortfolioRatingCounts', () => {
    it('calls portfolioRatingRepository.getPortfolioRatingCounts() and returns the correct number of likes/dislikes', async () => {
      const portfolioId = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';

      const ratingSpy = jest.spyOn(portfolioRatingRepository, 'count');

      const result = await service.getPortfolioRatingCounts(portfolioId);
      expect(result).toEqual({ likes: 32, dislikes: 1 });

      expect(ratingSpy).toHaveBeenCalledTimes(2);
      expect(ratingSpy).toHaveBeenNthCalledWith(1, { where: { portfolioId: portfolioId, isLiked: true } });
      expect(ratingSpy).toHaveBeenNthCalledWith(2, { where: { portfolioId: portfolioId, isLiked: false } });
    });
  });

  describe('getPortfolioUserRating', () => {
    it('calls portfolioRatingRepository.getPortfolioUserRating() and returns the correct rating', async () => {
      const portfolioId = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
      const userId = '807c6c8d-fb50-4284-a349-87a4eeefab63';

      const mockPortfolioRating: PortfolioRating = new PortfolioRating();
      mockPortfolioRating.id = '42263d1b-f932-41b2-aacd-99c792a16ed4';
      mockPortfolioRating.portfolioId = portfolioId;
      mockPortfolioRating.userId = userId;

      const repositorySpy = jest.spyOn(portfolioRatingRepository, 'findOne').mockResolvedValue(mockPortfolioRating);

      const result = await service.getPortfolioUserRating(portfolioId, userId);
      expect(result).toEqual(mockPortfolioRating);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(repositorySpy).toHaveBeenCalledWith({ where: { portfolioId: portfolioId, userId: userId } });
    });
  });

  describe('createOrUpdatePortfolioRating', () => {
    it('calls portfolioRatingRepository.createOrUpdatePortfolioRating() and returns the created/updated rating', async () => {
      const portfolioId = '73d8e169-2cb1-4a62-8bd9-e759f3f06cee';
      const userId = '807c6c8d-fb50-4284-a349-87a4eeefab63';
      const portfolioRatingId = '42263d1b-f932-41b2-aacd-99c792a16ed4';

      const mockPortfolioRating: PortfolioRating = new PortfolioRating();
      mockPortfolioRating.id = portfolioRatingId;
      mockPortfolioRating.portfolioId = portfolioId;
      mockPortfolioRating.userId = userId;

      const dto: CreatePortfolioRatingDto = {
        id: portfolioRatingId,
        isLiked: true,
      };

      const repositorySpy = jest
        .spyOn(portfolioRatingRepository, 'createOrUpdatePortfolioRating')
        .mockResolvedValue(mockPortfolioRating);

      const result = await service.createOrUpdatePortfolioRating(portfolioId, userId, dto);
      expect(result).toEqual(mockPortfolioRating);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(repositorySpy).toHaveBeenCalledWith(portfolioId, userId, dto);
    });
  });

  describe('deletePortfolioRating', () => {
    it('calls portfolioRatingRepository.delete() and delete the rating successfully', async () => {
      const portfolioRatingId = '42263d1b-f932-41b2-aacd-99c792a16ed4';

      // Affected != 0
      const repositorySpy = jest.spyOn(portfolioRatingRepository, 'delete').mockResolvedValue({ raw: '', affected: 1 });

      await service.deletePortfolioRating(portfolioRatingId);

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(repositorySpy).toHaveBeenCalledWith({ id: portfolioRatingId });
    });

    it('calls portfolioRatingRepository.delete() and throws a NotFoundException when the rating does not exist', async () => {
      const portfolioRatingId = '42263d1b-f932-41b2-aacd-99c792a16ed4';

      // Affected = 0
      const repositorySpy = jest.spyOn(portfolioRatingRepository, 'delete').mockResolvedValue({ raw: '', affected: 0 });

      // TODO: Figure out why jest has false positives for testing exceptions (below line passes even if you pass toThrow the wrong exception)
      // expect(service.deletePortfolioRating(portfolioRatingId)).rejects.toThrow(NotFoundException);

      // Alternative way of testing for exceptions
      try {
        await service.deletePortfolioRating(portfolioRatingId);
      } catch (err) {
        expect(err).toEqual(new NotFoundException(`Portfolio Rating with ID "${portfolioRatingId} not found`));
      }

      expect(repositorySpy).toHaveBeenCalledTimes(1);
      expect(repositorySpy).toHaveBeenCalledWith({ id: portfolioRatingId });
    });
  });
});
