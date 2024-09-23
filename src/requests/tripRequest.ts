import { AxiosInstance, AxiosResponse } from "axios";
import { formatDateToParams } from "../utils/dateHelper";
import { TransportationMode } from "../types/product";
import { Journey } from "../types/journey";

export type TripOptions = {
  generateCoordinatePaths?: boolean;
  generateTurnByTurnInstructions?: boolean;
  when?: Date;
  useWhenAs?: "departure" | "arrival";
  numberOfTrips?: number;
  maxChanges?: number;
  routeType?: "leasttime" | "leastinterchange" | "leastwalking";
  includedMeans?: TransportationMode[];
  excludedMeans?: TransportationMode[];
};

export async function requestTrips(
  axiosInstance: AxiosInstance,
  origin: string | { latitude: number; longitude: number },
  destination: string | { latitude: number; longitude: number },
  via?: string | { latitude: number; longitude: number },
  options?: TripOptions
): Promise<Journey[]> {
  const response: AxiosResponse<any> = await axiosInstance.get(
    `/XML_TRIP_REQUEST2`,
    {
      params: {
        name_origin:
          typeof origin === "string"
            ? origin
            : `${origin.longitude}:${origin.latitude}:WGS84`,
        type_origin: typeof origin === "string" ? "any" : "coord",
        name_destination:
          typeof destination === "string"
            ? destination
            : `${destination.longitude}:${destination.latitude}:WGS84`,
        type_destination: typeof destination === "string" ? "any" : "coord",
        ...((via && {
          name_via:
            typeof via === "string"
              ? via
              : `${via.longitude}:${via.latitude}:WGS84`,
          type_via: typeof via === "string" ? "any" : "coord",
        }) ||
          {}),
        deleteAssignedStops_origin: 1,
        deleteAssignedStops_destination: 1,
        genC: options?.generateCoordinatePaths ? 1 : 0,
        genP: options?.generateTurnByTurnInstructions ? 1 : 0,
        genMaps: 0,
        useUT: 1,
        useRealtime: 1,
        itdTripDateTimeDepArr: options?.useWhenAs === "arrival" ? "arr" : "dep",
        ...formatDateToParams(options?.when || new Date()),
        calcNumberOfTrips: options?.numberOfTrips || 4,
        calcOneDirection: 1, // prevents calculating trips before the given time
        ptOptionsActive: 1, // public transport options are active
        useProxFootSearch: 1, // search for stations near the given origin and destination
        maxChanges: options?.maxChanges || 9,
        routeType: options?.routeType || "leasttime",
        // for every entry in includedMeans, add a parameter includedMeans=entry
        ...options?.includedMeans?.reduce((acc, entry) => {
          return { ...acc, [`includedMeans`]: entry };
        }, {}),
        // for every entry in excludedMeans, add a parameter excludedMeans=entry
        ...options?.excludedMeans?.reduce((acc, entry) => {
          return { ...acc, [`excludedMeans`]: entry };
        }, {}),
      },
    }
  );
  return response.data.journeys;
}
