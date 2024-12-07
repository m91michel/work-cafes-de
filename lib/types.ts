export interface Cafe {
  city: string;
  name: string;
  address: string;
  wifi_speed: string;
  power_outlets: string;
  noise_level: string;
  opening_hours: string;
  website: string;
  image_url: string;
  slug: string;
}

export type CityData = {
  [key: string]: Cafe[];
};