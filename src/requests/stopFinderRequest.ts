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

const getBitmaskedLocalityType = (
  localityType: LocalityType
): number | null => {
  switch (localityType) {
    case LocalityType.any:
      return 0;
    case LocalityType.suburb:
      return 1;
    case LocalityType.stop:
      return 1 << 1;
    case LocalityType.street:
      return 1 << 2;
    case LocalityType.address:
      return 1 << 3;
    case LocalityType.intersection:
      return 1 << 4;
    case LocalityType.poi:
      return 1 << 5;
    case LocalityType.postcode:
      return 1 << 6;
    default:
      return null;
  }
};

export async function localitySearchForCoordinates(
  axiosInstance: AxiosInstance,
  coordinates: { lat: number; lon: number },
  customLocationName: string = "",
  maxResults: number = 10,
  filterFor: LocalityType[] = [LocalityType.any]
): Promise<StopFinderLocality[]> {
  const filter = filterFor
    .filter((val) => {
      // remove everything where getBitmaskedLocalityType returns null
      return getBitmaskedLocalityType(val) !== null;
    })
    .reduce((acc: number, curr) => acc | getBitmaskedLocalityType(curr)!, 0);

  const params: StopFinderRequestParams = {
    type_sf: "coord",
    name_sf: `${coordinates.lon}:${coordinates.lat}:WGS84:${customLocationName}`,
    anyObjFilter_sf: filter,
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
  const filter = filterFor
    .filter((val) => {
      // remove everything where getBitmaskedLocalityType returns null
      return getBitmaskedLocalityType(val) !== null;
    })
    .reduce((acc: number, curr) => acc | getBitmaskedLocalityType(curr)!, 0);

  const params: StopFinderRequestParams = {
    type_sf: "any",
    name_sf: searchQuery,
    anyObjFilter_sf: filter,
  };

  return await executeStopFinderRequest(axiosInstance, params).then((res) => {
    return res.slice(0, maxResults);
  });
}
