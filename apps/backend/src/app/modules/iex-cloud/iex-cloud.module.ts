require('dotenv').config();
import { HttpModule, Module } from '@nestjs/common';
import { IEX_CLOUD_SANDBOX_URL, IEX_CLOUD_PRODUCTION_URL } from '../../../constants';
import { IexCloudController } from './iex-cloud.controller';
import { IexCloudService } from './iex-cloud.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: JSON.parse(process.env.IEX_SANDBOX_MODE) ? IEX_CLOUD_SANDBOX_URL : IEX_CLOUD_PRODUCTION_URL,
      params: {
        token: JSON.parse(process.env.IEX_SANDBOX_MODE) ? process.env.IEX_SANDBOX_API_TOKEN : process.env.IEX_API_TOKEN,
      },
    }),
  ],
  controllers: [IexCloudController],
  providers: [IexCloudService],
  exports: [HttpModule],
})
export class IexCloudModule {}
