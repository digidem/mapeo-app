// @flow

export type MediaType = 'Photo' | 'Video' | 'Audio';

export interface ObservationMedia {
  source: string;
  type: MediaType;
}

export interface Observation {
  type: string;
  id: string;
  lat: number;
  lon: number;
  link: string;
  created: Date;
  name: string;
  notes: string;
  observedBy: string;
  media: ObservationMedia[];
}
