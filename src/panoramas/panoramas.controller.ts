import { Controller, Get, Param, Query } from '@nestjs/common';
import { PanoramaDTO } from './interfaces/panorama.dto';
import { Panorama } from './interfaces/panorama.entity';
import { PanoramasService } from './panoramas.service';

@Controller('panoramas')
export class PanoramasController {
  constructor(private readonly panoramasService: PanoramasService) {}

  @Get()
  async findAll(@Query('limit') limit?: number) {
    if (limit > 0) {
      return await this.panoramasService.findAllWithLimit(limit);
    } else {
      return await this.panoramasService.findAll();
    }
  }

  @Get('find')
  async findByLngLat(@Query() point: { lng: number; lat: number }) {
    return await this.panoramasService
      .findByLngLat(point)
      .then(panorama => convertInGeoJson(panorama[0]));
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
    return await this.panoramasService.findOneById(+id).then(panorama => {
      return this.panoramasService
        .findHotspotsByPanoramaId(panorama.id, distance)
        .then(hotspots => convertInGeoJson(panorama, hotspots));
    });
  }
}

export const convertInGeoJson = (
  panorama: Panorama,
  hotspots?: any,
): PanoramaDTO => {
  return {
    id: panorama.id,
    geometry: {
      type: panorama.location.type,
      coordinates: panorama.location.coordinates,
    },
    properties: {
      image: panorama.image,
      direction: +panorama.direction,
      timestamp: +panorama.timestamp,
      hotspots,
    },
  };
};
