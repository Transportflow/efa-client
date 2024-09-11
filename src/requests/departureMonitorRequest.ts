import { AxiosInstance } from "axios";
import { StopEvent } from "../types/stopEvent";
import { StopFinderLocality } from "../types/stopFinder";
import { formatDateToParams } from "../utils/dateHelper";

export async function executeDepartureMonitorRequest(
  axiosInstance: AxiosInstance,
  stop: string,
  when: Date,
  eventType: "arrival" | "departure" = "departure",
  maxResults: number = 15,
  onlyOutputBasicInformation: boolean = false
): Promise<{ location: StopFinderLocality; stopEvents: StopEvent[] }[]> {
  try {
    const response = await axiosInstance.get(`/XML_DM_REQUEST`, {
      params: {
        useRealtime: 1,
        useAllStops: 1,
        lsShowTrainsExplicit: 1,
        doNotSearchForStops: 1,
        useProxFootSearch: 0,
        mode: "direct",
        type_dm: "any",
        name_dm: stop,
        limit: maxResults,
        itdDateTimeDepArr: eventType === "arrival" ? "arr" : "dep",
        ...formatDateToParams(when),
      },
    });

    // the response is an array of locations and an array of stopEvents
    // we want to split them in a single array with objects containing a single location and the stopEvents
    // this makes it easier to work with the data
    let entries: { location: StopFinderLocality; stopEvents: StopEvent[] }[] =
      [];
    // for each location in the response create a new object with the location and the stopEvents for this location
    response.data.locations.forEach((location: StopFinderLocality) => {
      let stopEvents = response.data.stopEvents.filter(
        (stopEvent: StopEvent) => {
          if (stopEvent.location.parent) {
            return stopEvent.location.parent.id === location.id;
          } else {
            return stopEvent.location.id.startsWith(location.id);
          }
        }
      );

      // calculate delay between planned and estimated time
      stopEvents.forEach((stopEvent: StopEvent) => {
        if (
          stopEvent.departureTimePlanned &&
          stopEvent.departureTimeEstimated
        ) {
          const planned = new Date(stopEvent.departureTimePlanned);
          const estimated = new Date(stopEvent.departureTimeEstimated);
          stopEvent.departureDelay =
            (estimated.getTime() - planned.getTime()) / 1000 / 60;
        }
        if (stopEvent.arrivalTimePlanned && stopEvent.arrivalTimeEstimated) {
          const planned = new Date(stopEvent.arrivalTimePlanned);
          const estimated = new Date(stopEvent.arrivalTimeEstimated);
          stopEvent.arrivalDelay =
            (estimated.getTime() - planned.getTime()) / 1000 / 60;
        }
      });

      // sort stopEvents by departureTimeEstimated
      stopEvents.sort((a: StopEvent, b: StopEvent) => {
        if (
          (a.departureTimeEstimated && b.departureTimeEstimated) ||
          (a.departureTimePlanned && b.departureTimePlanned)
        ) {
          return (
            new Date(
              a.departureTimeEstimated || a.departureTimePlanned
            ).getTime() -
            new Date(
              b.departureTimeEstimated || b.departureTimePlanned
            ).getTime()
          );
        }
        if (
          (a.arrivalTimeEstimated && b.arrivalTimeEstimated) ||
          (a.arrivalTimePlanned && b.arrivalTimePlanned)
        ) {
          return (
            new Date(a.arrivalTimeEstimated || a.arrivalTimePlanned).getTime() -
            new Date(b.arrivalTimeEstimated || b.arrivalTimePlanned).getTime()
          );
        }
      });

      if (onlyOutputBasicInformation) {
        stopEvents.forEach((stopEvent: StopEvent) => {
          stopEvent.location = {
            id: stopEvent.location.id,
            type: stopEvent.location.type,
            properties: stopEvent.location.properties,
          };
          delete stopEvent.infos;
          delete stopEvent.hints;
        });
      }

      entries.push({
        location,
        stopEvents: stopEvents,
      });
    });

    return entries;
  } catch (error) {
    throw new Error(`GET departure monitor failed: ${error}`);
  }
}
