import { Inject, Injectable } from '@nestjs/common';
import sequelize, { Op } from 'sequelize';
import { PANORAMA_REPOSITORY } from 'src/core/constants';
import { WGS84ToLambert93 } from 'src/core/utils/postgis.util';
import { LngLat } from './models/panoramas.model';
import { Panorama } from './panorama.entity';

@Injectable()
export class PanoramasService {
  constructor(
    @Inject(PANORAMA_REPOSITORY)
    private readonly panoramaRepository: typeof Panorama,
  ) {}

  async findAll(limit = 0): Promise<Panorama[]> {
    return await this.panoramaRepository.findAll<Panorama>({ limit });
  }

  async findByLngLat(point: LngLat, limit = 1): Promise<Panorama[]> {
    const from = sequelize.fn(
      'ST_GeomFromText',
      `POINT(${point.lng} ${point.lat})`,
      4326,
    );
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

  async findOneByIdWithHotspot(id: number, around: number): Promise<any> {
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
        [distance, 'distance'],
        [sequelize.fn('degrees', direction), 'direction'],
      ],
      where: sequelize.where(distance, { [Op.lte]: around }),
      order: distance,
      offset: 1,
    });

    panorama.setDataValue('hotspots', hotspots as any);

    return panorama;
  }
}
