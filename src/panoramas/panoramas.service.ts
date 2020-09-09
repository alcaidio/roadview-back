import { Inject, Injectable } from '@nestjs/common';
import sequelize, { Op } from 'sequelize';
import { PANORAMA_REPOSITORY } from 'src/core/constants';
import { WGS84ToLambert93 } from 'src/core/utils/postgis.util';
import { Panorama } from './interfaces/panorama.entity';
import { LngLat } from './interfaces/panorama.model';

@Injectable()
export class PanoramasService {
  constructor(
    @Inject(PANORAMA_REPOSITORY)
    private readonly panoramaRepository: typeof Panorama,
  ) {}

  async findAll(): Promise<Panorama[]> {
    return await this.panoramaRepository.findAll<Panorama>();
  }

  async findAllWithLimit(limit: number): Promise<Panorama[]> {
    return await this.panoramaRepository.findAll<Panorama>({ limit });
  }

  async findByLngLat(point: LngLat, limit = 1): Promise<Panorama[]> {
    const { lng, lat } = point;
    const from = sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`, 4326);
    return await this.panoramaRepository.findAll<Panorama>({
      order: sequelize.fn('ST_Distance', sequelize.col('location'), from),
      limit,
    });
  }

  async findOneById(id: number): Promise<Panorama> {
    return await this.panoramaRepository.findOne<Panorama>({
      where: { id },
    });
  }

  async findHotspotsByPanoramaId(id: number, around: number) {
    const panorama = await this.findOneById(id);
    const [lng, lat] = panorama.location.coordinates;
    const from = sequelize.fn('ST_GeomFromText', `POINT(${lng} ${lat})`, 4326);
    const distance = sequelize.fn(
      'ST_Distance',
      WGS84ToLambert93(sequelize.col('location')),
      WGS84ToLambert93(from),
    );

    const direction = sequelize.fn(
      'ST_Azimuth',
      sequelize.col('location'),
      from,
    );

    const hotspots = await this.panoramaRepository.findAll({
      attributes: [
        'id',
        [distance, 'distance'],
        [sequelize.fn('degrees', direction), 'direction'],
      ],
      where: sequelize.where(distance, { [Op.lte]: around }),
      order: distance,
      offset: 1,
    });
    return hotspots;
  }
}
