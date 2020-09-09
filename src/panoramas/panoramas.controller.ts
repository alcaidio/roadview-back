import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  HotspotDTO,
  PanoramaDTO,
  PanoramaListDTO,
} from './interfaces/panorama.dto';
import { Panorama } from './interfaces/panorama.entity';
import { PanoramasService } from './panoramas.service';

@Controller('panoramas')
export class PanoramasController {
  constructor(private readonly panoramasService: PanoramasService) {}

  @Get()
  async findAll(@Query('limit') limit?: number) {
    if (limit > 0) {
      return await this.panoramasService
        .findAllWithLimit(limit)
        .then(panoramas => convertInGeoJsonFeatureCollection(panoramas));
    } else {
      return await this.panoramasService
        .findAll()
        .then(panoramas => convertInGeoJsonFeatureCollection(panoramas));
    }
  }

  @Get('find')
  async findByLngLat(@Query() point: { lng: number; lat: number }) {
    return await this.panoramasService
      .findNearestPointByLngLat(point)
      .then(panorama => convertInGeoJsonFeature(panorama[0]));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.panoramasService
      .findOneById(+id)
      .then(panorama => convertInGeoJsonFeature(panorama));
  }

  @Get(':id/hotspots')
  async findOneWithHotspots(
    @Param('id') id: string,
    @Query('from') from: number,
    @Query('to') to: number,
  ) {
    if (from === undefined || to === undefined) {
      throw new HttpException(
        'The query must be like - api/v1/panoramas/:id/hotspots?from=4&to=15 ',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.panoramasService.findOneById(+id).then(panorama => {
      return this.panoramasService
        .findHotspotsByPanoramaId(panorama.id, from, to)
        .then(hotspots => convertInGeoJsonFeature(panorama, hotspots));
    });
  }
}

const convertInGeoJsonFeatureCollection = (
  panoramas: Panorama[],
): PanoramaListDTO => {
  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };
  panoramas.map(panorama => {
    geojson.features.push(convertInGeoJsonFeature(panorama) as PanoramaDTO);
  });
  return geojson;
};

const convertInGeoJsonFeature = (
  panorama: Panorama,
  hotspots?: any[], // no hotspotDtO
): PanoramaDTO => {
  return {
    id: panorama.id,
    type: 'Feature',
    geometry: {
      type: panorama.location.type,
      coordinates: panorama.location.coordinates,
    },
    properties: {
      image: panorama.image,
      direction: +panorama.direction,
      timestamp: +panorama.timestamp,
      hotspots: hotspots
        ? incrementePanoramaDirectionInHotspots(hotspots, panorama.direction)
        : [],
    },
  };
};

const incrementePanoramaDirectionInHotspots = (
  hotspots: HotspotDTO[],
  direction: number,
): HotspotDTO[] => {
  hotspots.map(e => (e.direction = +e.direction - +direction));
  return hotspots;
};
