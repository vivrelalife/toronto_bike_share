import { Station, StationStatus } from '../types';

export type ApplicationActions =
  | {
      type: 'LOAD_STATIONS';
      stations: Station[];
    }
  | {
      type: 'SET_STATIONS';
      stations: Station[];
    }
  | {
      type: 'SET_STATIONS_STATUS';
      statuses: StationStatus[];
    };

export interface ApplicationState {
  loading: boolean;
  stations: Station[];
  statusesLoaded: boolean;
}

export const applicationInitialState: ApplicationState = {
  loading: false,
  stations: [],
  statusesLoaded: false,
};

export const applicationReducer = (
  state: ApplicationState,
  action: ApplicationActions,
): ApplicationState => {
  switch (action.type) {
    case 'LOAD_STATIONS': {
      return { ...state, loading: true, statusesLoaded: false };
    }
    case 'SET_STATIONS': {
      const { stations } = action;
      // I don't normally use comments but, ant the library for the table requires a unique property key per record
      stations.map((station) => {
        station.key = station.station_id;
        return station;
      });
      return {
        ...state,
        loading: true,
        statusesLoaded: false,
        stations: stations.sort((a, b) => a.name.localeCompare(b.name)),
      };
    }
    case 'SET_STATIONS_STATUS': {
      const { statuses } = action;
      const updatedStations = state.stations.map((station) => {
        const matchingStatus = statuses.find(
          (status) => status.station_id === station.station_id,
        );
        if (matchingStatus) {
          const { num_bikes_available, status } = matchingStatus;
          station = { ...station, num_bikes_available, status };
        }
        return station;
      });
      return {
        ...state,
        loading: false,
        stations: updatedStations,
        statusesLoaded: true,
      };
    }

    default:
      return state;
  }
};
