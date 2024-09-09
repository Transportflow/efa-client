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
            const errorMessage = "";
            errors.forEach((error) => {
              const errorDetails = getErrorDetails(error.code);
              const m = `Error Code ${error.code}: ${errorDetails.description}`;
              console.error(m);

              if (errorDetails.nonCritical !== true) {
                errorMessage.concat(errorMessage, "\n", m);
              }
            });
            if (errorMessage.length > 0) {
              return Promise.reject(new Error(errorMessage));
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

  public async getSystemInfo(): Promise<SystemInfo> {
    return getSystemInfo(this.axiosInstance);
  }

  public async findLocationsWithCoordiantes(
    coordinates: { lat: number; lon: number },
    customLocationName: string = "",
    maxResults: number = 10,
    filterFor: number[] = [LocalityType.any]
  ): Promise<StopFinderLocality[]> {
    return localitySearchForCoordinates(
      this.axiosInstance,
      coordinates,
      customLocationName,
      maxResults,
      filterFor
    );
  }

  public async findLocationsWithSearchQuery(
    searchQuery: string,
    maxResults: number = 10,
    filterFor: number[] = [LocalityType.any]
  ): Promise<StopFinderLocality[]> {
    return localitySearchForSearchQuery(
      this.axiosInstance,
      searchQuery,
      maxResults,
      filterFor
    );
  }
}

export default EfaClient;
