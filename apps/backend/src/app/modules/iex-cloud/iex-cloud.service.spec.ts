import { HttpModule, HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IexCloudService } from './iex-cloud.service';

describe('IexCloudService', () => {
  let service: IexCloudService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [IexCloudService],
    }).compile();

    service = module.get<IexCloudService>(IexCloudService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
