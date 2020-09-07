export interface LngLat {
  lng: number;
  lat: number;
}

export interface Location {
  type: 'Point';
  coordinates: [number, number];
}
