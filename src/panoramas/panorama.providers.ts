import { PANORAMA_REPOSITORY } from 'src/core/constants';
import { Panorama } from './interfaces/panorama.entity';

export const panoramasProviders = [
  {
    provide: PANORAMA_REPOSITORY,
    useValue: Panorama,
  },
];
