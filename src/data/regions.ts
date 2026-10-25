import type { LonLat } from "../lib/geo";

export interface Region {
  id: string;
  name: string;
  center: LonLat;
  sizeKm: number;
}

/**
 * The pasture used by the live demo: rolling hill country on the edge of the
 * Sierra de la Demanda (Burgos), the area featured in the company's own blog.
 */
export const PASTURE: Region = {
  id: "demanda",
  name: "Sierra de la Demanda, Burgos",
  center: [-3.33, 42.03],
  sizeKm: 4,
};

export const REGIONS: Region[] = [PASTURE];
