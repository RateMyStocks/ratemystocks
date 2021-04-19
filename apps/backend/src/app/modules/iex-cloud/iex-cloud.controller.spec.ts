import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IexCloudController } from './iex-cloud.controller';
import { IexCloudService } from './iex-cloud.service';

describe('IexCloudController', () => {
  let controller: IexCloudController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [IexCloudController],
      providers: [IexCloudService],
    }).compile();

    controller = module.get<IexCloudController>(IexCloudController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
