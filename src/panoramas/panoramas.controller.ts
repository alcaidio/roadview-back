import { Controller, Get, Param, Query } from '@nestjs/common';
import { LngLat } from './models/panoramas.model';
import { PanoramasService } from './panoramas.service';

@Controller('panoramas')
export class PanoramasController {
  constructor(private readonly panoramasService: PanoramasService) {}

  @Get()
  async findAll() {
    return await this.panoramasService.findAll();
  }

  @Get('limit')
  async findAllWithLimit(@Query() limit: number) {
    return await this.panoramasService.findAll(limit);
  }

  @Get('find')
  async findByLngLat(@Query() point: LngLat) {
    return await this.panoramasService.findByLngLat(point);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.panoramasService.findOneById(+id);
  }

  @Get(':id/hotspots')
  async findOneWithHotspots(
    @Param('id') id: string,
    @Query('distance') distance: number,
  ) {
    if (distance === undefined) distance = 10;
    return await this.panoramasService.findOneByIdWithHotspot(+id, distance);
  }
}
