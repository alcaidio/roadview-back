import { PANORAMA_REPOSITORY } from 'src/core/constants';
import { Panorama } from './panorama.entity';

export const panoramasProviders = [
  {
    provide: PANORAMA_REPOSITORY,
    useValue: Panorama,
  },
];
