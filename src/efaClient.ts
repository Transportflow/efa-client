import axios, { AxiosInstance } from "axios";
import { getErrorDetails, SystemMessage } from "./types/systemMessage";
import { SystemInfo } from "./types/systemInfo";
import { getSystemInfo } from "./requests/systemRequest";

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
              const m = `Error Code ${error.code}: ${getErrorDetails(
                error.code
              )}`;
              console.error(m);
              errorMessage.concat(errorMessage, "\n", m);
            });
            return Promise.reject(new Error(errorMessage));
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

  /*public async findStops(query: string): Promise<Station[]> {
    return findStops(this.axiosInstance, query);
  }*/
}

export default EfaClient;
