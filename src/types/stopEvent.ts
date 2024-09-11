import { ICSInfo } from "./icsInfo";
import { StopFinderLocality } from "./stopFinder";
import { Transportation } from "./transportation";

export type StopEvent = {
  realtimeStatus?: string[];
  isRealtimeControlled?: boolean;
  location: StopFinderLocality & {
    properties: {
      occupancy?: string;
      area?: string;
      platform?: string;
      platformName?: string;
      plannedPlatformName?: string;
    };
  };
  arrivalTimePlanned: string;
  arrivalTimeBaseTimetable?: string;
  arrivalTimeEstimated: string;
  departureTimePlanned: string;
  departureTimeBaseTimetable?: string;
  departureTimeEstimated: string;
  arrivalDelay?: number;
  departureDelay?: number;
  transportation?: Transportation;
  infos?: ICSInfo[];
  hints?: {
    content: string;
    providerCode: string;
    type: string;
    properties: { [key: string]: string };
  }[];
};
