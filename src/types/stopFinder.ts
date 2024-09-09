import { Locality, LocalityType } from "./locality";

// it is possible to pass in a string with a specific format to the stopfinder to search for a coordinate
// the format is "lon:lat:WGS84:<custom name>"
export type StopFinderRequestParams = {
  type_sf: "any" | "coord";
  name_sf: string;
  anyMaxSizeHitList?: number; // amount results to return
  anySigWhenPerfectNoOtherMatches?: number; // no other result for perfect matches
  anyObjFilter_sf?: LocalityType; // anyObjFilter_sf filters results as bitmasked LocalityType
};

export type StopFinderLocality = Locality & {
  matchQuality?: number;
  isBest?: boolean;
};
