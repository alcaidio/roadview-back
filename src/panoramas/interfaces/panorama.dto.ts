export interface PanoramaDTO {
  id: number;
  geometry: GeoJSON.Geometry;
  properties: {
    image: string;
    direction: number;
    timestamp: number;
    hotspots?: Hotspot[];
  };
}

export interface Hotspot {
  panoId: number;
  distance: number;
  direction: number;
}
