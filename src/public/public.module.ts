import { Module } from '@nestjs/common';
import { PublicGateway } from './public.gateaway';
import { OkxService } from 'src/utils/okx';

@Module({
  imports: [],
  providers: [PublicGateway, OkxService],
})
export class PublicModule {}
