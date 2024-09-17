import axios, { AxiosInstance } from "axios";
import { getErrorDetails, SystemMessage } from "./types/systemMessage";
import { SystemInfo } from "./types/systemInfo";
import { getSystemInfo } from "./requests/systemRequest";
import {
  localitySearchForCoordinates,
  localitySearchForSearchQuery,
} from "./requests/stopFinderRequest";
import { Locality, LocalityType } from "./types/locality";
import { StopFinderLocality } from "./types/stopFinder";
import { StopEvent } from "./types/stopEvent";
import { executeDepartureMonitorRequest } from "./requests/departureMonitorRequest";
import {
  fptfLeg,
  fptfLocation,
  fptfMode,
  fptfStation,
  fptfStop,
  fptfStopover,
} from "./types/fptf";
import { TransportationMode } from "./types/product";
import { requestTrips, TripOptions } from "./requests/tripRequest";
import { Journey } from "./types/journey";

class EfaClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL: baseURL,
    });

    this.axiosInstance.interceptors.request.use((config) => {
      if (!config.params) {
        config.params = {};
      }
      config.params["outputFormat"] = "rapidJSON";
      config.params["coordOutputFormat"] = "WGS84[dd.ddddd]";
      config.params["locationServerActive"] = "1";

      return config;
    });

    // Interceptor for handling system messages
    this.axiosInstance.interceptors.response.use(
      (response) => {
        if (response.data.systemMessages) {
          const systemMessages: SystemMessage[] = response.data.systemMessages;
          const errors = systemMessages.filter((msg) => msg.type === "error");
          if (errors.length > 0) {
            let errorMessages: string[] = [];
            errors.forEach((error) => {
              const errorDetails = getErrorDetails(error.code);
              const m = `Code ${error.code}: ${errorDetails.description}`;
              console.error(m);

              if (errorDetails.nonCritical !== true) {
                errorMessages.push(m);
              }
            });
            if (errorMessages.length > 0) {
              return Promise.reject(new Error(errorMessages.join("\n")));
            }
          }
          const warnings = systemMessages.filter(
            (msg) => msg.type === "warning"
          );
          if (warnings.length > 0) {
            warnings.forEach((warning) => {
              console.warn(
                `Warning Code ${warning.code}: ${getErrorDetails(warning.code)}`
              );
            });
          }
        }
        return response;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  public async systemInfo(): Promise<SystemInfo> {
    return getSystemInfo(this.axiosInstance);
  }

  public async locationsWithCoordiantes(
    coordinates: { lat: number; lon: number },
    customLocationName: string = "",
    maxResults: number = 10,
    filterFor: LocalityType[] = [LocalityType.any]
  ): Promise<StopFinderLocality[]> {
    return localitySearchForCoordinates(
      this.axiosInstance,
      coordinates,
      customLocationName,
      maxResults,
      filterFor
    );
  }

  public async locationsWithSearchQuery(
    searchQuery: string,
    maxResults: number = 10,
    filterFor: LocalityType[] = [LocalityType.any]
  ): Promise<StopFinderLocality[]> {
    return localitySearchForSearchQuery(
      this.axiosInstance,
      searchQuery,
      maxResults,
      filterFor
    );
  }

  public async stopEvents(
    stop: string,
    when: Date = new Date(),
    eventType?: "departure" | "arrival",
    maxResults?: number,
    minimal?: boolean
  ): Promise<{ location: StopFinderLocality; stopEvents: StopEvent[] }[]> {
    return await executeDepartureMonitorRequest(
      this.axiosInstance,
      stop,
      when,
      eventType,
      maxResults,
      minimal
    );
  }

  public async trips(
    origin: string | { latitude: number; longitude: number },
    destination: string | { latitude: number; longitude: number },
    via?: string | { latitude: number; longitude: number },
    options?: TripOptions
  ): Promise<Journey[]> {
    return await requestTrips(
      this.axiosInstance,
      origin,
      destination,
      via,
      options
    );
  }
}

export default EfaClient;
