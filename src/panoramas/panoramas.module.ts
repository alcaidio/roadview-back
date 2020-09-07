import { Module } from '@nestjs/common';
import { panoramasProviders } from './panorama.providers';
import { PanoramasController } from './panoramas.controller';
import { PanoramasService } from './panoramas.service';

@Module({
  controllers: [PanoramasController],
  providers: [PanoramasService, ...panoramasProviders],
  exports: [PanoramasService],
})
export class PanoramasModule {}
