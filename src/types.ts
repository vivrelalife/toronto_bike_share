export interface Station {
  key: string;
  address: string;
  altitude: number;
  capacity: number;
  groups: [];
  lat: number;
  lon: number;
  name: string;
  nearby_distance: 500;
  obcn: string;
  physical_configuration: string;
  rental_methods: string[];
  station_id: string;
  num_bikes_available?: number;
  status?: string;
}

export interface StationStatus {
  is_charging_station: boolean;
  is_installed: number;
  is_renting: number;
  is_returning: number;
  last_reported: number;
  num_bikes_available: number;
  num_bikes_available_types: { mechanical: number; ebike: number };
  num_bikes_disabled: number;
  num_docks_available: number;
  num_docks_disabled: number;
  station_id: string;
  status: string;
}
