import {
  fptfLeg,
  fptfLocation,
  fptfMode,
  fptfStation,
  fptfStop,
} from "../types/fptf";
import { Locality, LocalityType } from "../types/locality";
import { TransportationMode } from "../types/product";
import { StopEvent } from "../types/stopEvent";

export function convertLocalityToFTPF(
  location: Locality
): (fptfLocation | fptfStation | fptfStop)[] {
  let additionalAssignedStops: (fptfLocation | fptfStation | fptfStop)[] = [];
  if (location.assignedStops) {
    // INFO: we are assuming that there are no assignedStops inside assignedStops
    additionalAssignedStops = location.assignedStops.map((stop) => {
      return convertLocalityToFTPF(stop)[0];
    });
  }

  if (location.type == LocalityType.platform) {
    return [
      {
        type: "stop",
        id: location.id,
        name: location.name,
        location: location.parent && convertLocalityToFTPF(location.parent),
        station: {
          type: "station",
          id: location.parent?.id,
          name: location.parent?.name,
        },
        properties: location.properties,
      } as fptfStop,
      ...additionalAssignedStops,
    ];
  }

  if (location.type == LocalityType.stop) {
    return [
      {
        type: "station",
        id: location.id,
        name: location.name,
        location: location.coord && {
          type: "location",
          id: location.parent?.id || location.id,
          name: location.parent?.name || location.name,
          latitude: location.coord && location.coord[0],
          longitude: location.coord && location.coord[1],
        },
        properties: location.properties,
      } as fptfStation,
      ...additionalAssignedStops,
    ];
  }

  return [
    {
      type: "location",
      id: location.id,
      name: location.name,
      address: location.disassembledName,
      latitude: location.coord && location.coord[0],
      longitude: location.coord && location.coord[1],
      properties: location.properties,
    } as fptfLocation,
    ...additionalAssignedStops,
  ];
}

export function convertStopEventToFTPF(stopEvent: StopEvent): fptfLeg {
  let departureTime =
    stopEvent.departureTimeEstimated ||
    stopEvent.departureTimePlanned ||
    stopEvent.departureTimeBaseTimetable;
  let plannedDepartureTime =
    stopEvent.departureTimePlanned || stopEvent.departureTimeBaseTimetable;
  let arrivalTime =
    stopEvent.arrivalTimeEstimated ||
    stopEvent.arrivalTimePlanned ||
    stopEvent.arrivalTimeBaseTimetable;
  let plannedArrivalTime =
    stopEvent.arrivalTimePlanned || stopEvent.arrivalTimeBaseTimetable;
  return {
    type: "leg",
    id: stopEvent.transportation.id,
    origin: convertLocalityToFTPF(stopEvent.transportation.origin)[0],
    destination: convertLocalityToFTPF(stopEvent.transportation.destination)[0],
    departure: departureTime,
    plannedDeparture: plannedDepartureTime,
    // in seconds
    departureDelay:
      departureTime &&
      plannedDepartureTime &&
      (new Date(departureTime).getTime() -
        new Date(plannedDepartureTime).getTime()) /
        1000,
    arrival: arrivalTime,
    plannedArrival: plannedArrivalTime,
    // in seconds
    arrivalDelay:
      arrivalTime &&
      plannedArrivalTime &&
      (new Date(arrivalTime).getTime() -
        new Date(plannedArrivalTime).getTime()) /
        1000,
    mode: convertModeToFTPF(stopEvent.transportation.product.class),
    subMode: stopEvent.transportation.product.name,
    public: true,
    operator: {
      type: "operator",
      id: stopEvent.transportation.operator.id,
      name: stopEvent.transportation.operator.name,
    },
    departurePlatform:
      plannedDepartureTime && stopEvent.location.disassembledName,
    arrivalPlatform: plannedArrivalTime && stopEvent.location.disassembledName,
    line: {
      id: stopEvent.transportation.id,
      name: stopEvent.transportation.number,
      mode: convertModeToFTPF(stopEvent.transportation.product.class),
      subMode: stopEvent.transportation.product.name,
    },
    properties: {
      ...stopEvent.transportation.properties,
      ...stopEvent.location.properties,
    },
  } as fptfLeg;
}

export const convertModeToFTPF = (
  mode: TransportationMode
): fptfMode | null => {
  switch (mode) {
    case TransportationMode.train:
      return fptfMode.train;
    case TransportationMode.commuterRailway:
      return fptfMode.train;
    case TransportationMode.undergroundTrain:
      return fptfMode.train;
    case TransportationMode.cityRail:
      return fptfMode.train;
    case TransportationMode.tram:
      return fptfMode.train;
    case TransportationMode.cityBus:
      return fptfMode.bus;
    case TransportationMode.regionalBus:
      return fptfMode.bus;
    case TransportationMode.coach:
      return fptfMode.bus;
    case TransportationMode.cableCar:
      return fptfMode.gondola;
    case TransportationMode.boat:
      return fptfMode.watercraft;
    case TransportationMode.transitOnDemand:
      return fptfMode.taxi;
    case TransportationMode.other:
      return null;
    case TransportationMode.airplane:
      return fptfMode.aircraft;
    case TransportationMode.regionalTrain:
      return fptfMode.train;
    case TransportationMode.nationalTrain:
      return fptfMode.train;
    case TransportationMode.internationalTrain:
      return fptfMode.train;
    case TransportationMode.highSpeedTrain:
      return fptfMode.train;
    case TransportationMode.railReplacementTrain:
      return fptfMode.bus;
    case TransportationMode.shuttleTrain:
      return fptfMode.train;
    case TransportationMode.buergerBus:
      return fptfMode.bus;
    case TransportationMode.footpath:
      return fptfMode.walking;
    case TransportationMode.bikeAndRide:
      return fptfMode.bicycle;
    case TransportationMode.takeYourBikeAlong:
      return fptfMode.bicycle;
    case TransportationMode.kissAndRide:
      return fptfMode.car;
    case TransportationMode.parkAndRide:
      return fptfMode.car;
  }
  return null;
};
