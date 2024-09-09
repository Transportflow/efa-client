import { AxiosInstance } from "axios";
import {
  StopFinderLocality,
  StopFinderRequestParams,
} from "../types/stopFinder";
import { Locality, LocalityType } from "../types/locality";

async function executeStopFinderRequest(
  axiosInstance: AxiosInstance,
  params: StopFinderRequestParams
): Promise<StopFinderLocality[]> {
  try {
    const request = await axiosInstance.get(`/XML_STOPFINDER_REQUEST`, {
      params: params,
    });
    return request.data["locations"];
  } catch (error) {
    throw new Error(`GET stopfinder request failed: ${error}`);
  }
}

export async function localitySearchForCoordinates(
  axiosInstance: AxiosInstance,
  coordinates: { lat: number; lon: number },
  customLocationName: string = "",
  maxResults: number = 10,
  filterFor: LocalityType[] = [LocalityType.any]
): Promise<StopFinderLocality[]> {
  const params: StopFinderRequestParams = {
    type_sf: "coord",
    name_sf: `${coordinates.lon}:${coordinates.lat}:WGS84:${customLocationName}`,
    anyObjFilter_sf: filterFor.reduce(
      (acc: LocalityType, curr) => acc | curr,
      0
    ),
  };

  return await executeStopFinderRequest(axiosInstance, params).then((res) => {
    return res.slice(0, maxResults);
  });
}

export async function localitySearchForSearchQuery(
  axiosInstance: AxiosInstance,
  searchQuery: string,
  maxResults: number = 10,
  filterFor: LocalityType[] = [LocalityType.any]
): Promise<StopFinderLocality[]> {
  const params: StopFinderRequestParams = {
    type_sf: "any",
    name_sf: searchQuery,
    anyObjFilter_sf: filterFor.reduce(
      (acc: LocalityType, curr) => acc | curr,
      0
    ),
  };

  return await executeStopFinderRequest(axiosInstance, params).then((res) => {
    return res.slice(0, maxResults);
  });
}
