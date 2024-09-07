import { AxiosInstance, AxiosResponse } from "axios";
import { SystemInfo } from "../types/systemInfo";

export async function getSystemInfo(
  axiosInstance: AxiosInstance
): Promise<SystemInfo> {
  try {
    const response: AxiosResponse<any> = await axiosInstance.get(
      `/XML_SYSTEMINFO_REQUEST`
    );
    return response.data;
  } catch (error) {
    throw new Error(`GET system information failed: ${error}`);
  }
}
