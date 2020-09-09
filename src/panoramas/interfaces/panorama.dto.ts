export interface PanoramaDTO {
  type: 'Feature';
  id: number;
  geometry: GeoJSON.Geometry;
  properties: {
    image: string;
    direction: number;
    timestamp: number;
    hotspots?: HotspotDTO[];
  };
}
export interface PanoramaListDTO {
  type: 'FeatureCollection' | string;
  features: PanoramaDTO[];
}

export interface HotspotDTO {
  panoId: number;
  distance: number;
  direction: number;
}
