import {
  fptfJourney,
  fptfLeg,
  fptfLine,
  fptfLocation,
  fptfMode,
  fptfPrice,
  fptfStation,
  fptfStop,
  fptfStopover,
} from "../types/fptf";
import { Fare, Journey, Leg } from "../types/journey";
import { Locality, LocalityType } from "../types/locality";
import { TransportationMode } from "../types/product";
import { StopEvent } from "../types/stopEvent";

export function convertLocalityToFPTF(
  location: Locality,
  minimal: boolean = false
): (fptfLocation | fptfStation | fptfStop)[] {
  let additionalAssignedStops: (fptfLocation | fptfStation | fptfStop)[] = [];
  if (location.assignedStops) {
    // INFO: we are assuming that there are no assignedStops inside assignedStops
    additionalAssignedStops = location.assignedStops
      .filter((s) => s.id != location.id)
      .map((stop) => {
        return convertLocalityToFPTF(stop)[0];
      });
  }

  if (location.type == LocalityType.platform) {
    return [
      {
        type: "stop",
        id: location.id,
        name: location.name,
        location: location.parent &&
          location.parent.parent && {
            type: "location",
            id:
              location.parent?.parent.id || location.parent?.id || location.id,
            name:
              location.parent?.parent.name ||
              location.parent?.name ||
              location.name,
            latitude:
              (location.coord && location.coord[0]) ||
              (location.parent.coord && location.parent.coord[0]),
            longitude:
              (location.coord && location.coord[1]) ||
              (location.parent.coord && location.parent.coord[1]),
          },
        ...(!minimal && {
          station: {
            type: "station",
            id: location.parent?.id,
            name: location.parent?.name,
          },
          properties: location.properties,
        }),
      } as fptfStop,
      ...additionalAssignedStops,
    ];
  }

  if (location.type == LocalityType.stop) {
    return [
      {
        type: "station",
        id: location.id,
        name: location.disassembledName || location.name,
        location: location.coord && {
          type: "location",
          id: location.parent?.id || location.id,
          name: location.parent?.name || location.name,
          latitude: location.coord && location.coord[0],
          longitude: location.coord && location.coord[1],
        },
        ...(!minimal && { properties: location.properties }),
      } as fptfStation,
      ...additionalAssignedStops,
    ];
  }

  return [
    {
      type: "location",
      id: location.id,
      name: location.disassembledName || location.name,
      address: location.disassembledName,
      latitude: location.coord && location.coord[0],
      longitude: location.coord && location.coord[1],
      ...(!minimal && { properties: location.properties }),
    } as fptfLocation,
    ...additionalAssignedStops,
  ];
}

export function convertStopEventToFPTF(
  stopEvent: StopEvent,
  minimal: boolean = false
): fptfLeg {
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
    id: stopEvent.transportation?.id,
    cancelled: stopEvent.isCancelled || false,
    origin:
      stopEvent.transportation?.origin &&
      convertLocalityToFPTF(stopEvent.transportation?.origin, minimal)[0],
    destination:
      stopEvent.transportation?.destination &&
      convertLocalityToFPTF(stopEvent.transportation?.destination, minimal)[0],
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
    mode:
      stopEvent.transportation &&
      convertModeToFPTF(stopEvent.transportation!.product.class),
    subMode: stopEvent.transportation && stopEvent.transportation.product.name,
    public: true,
    operator: stopEvent.transportation && {
      type: "operator",
      id: stopEvent.transportation.operator.id,
      name: stopEvent.transportation.operator.name,
    },
    departurePlatform:
      plannedDepartureTime && stopEvent.location.properties.platform,
    arrivalPlatform:
      plannedArrivalTime && stopEvent.location.properties.platform,
    line: stopEvent.transportation && {
      id: stopEvent.transportation.id,
      name: stopEvent.transportation.number,
      mode: convertModeToFPTF(stopEvent.transportation.product.class),
      subMode: stopEvent.transportation.product.name,
    },
    ...((stopEvent.infos || stopEvent.hints) && {
      remarks: [
        ...(stopEvent.infos || [])
          .flatMap((i) => i.infoLinks)
          .map((info) => ({
            type: "info",
            title: info.title,
            subtitle: info.subtitle,
            content: info.content,
          })),
        ...(stopEvent.hints || []).map((hint) => ({
          type: "hint",
          content: hint.content,
        })),
      ],
    }),
    properties: {
      ...stopEvent.transportation?.properties,
      ...stopEvent.location.properties,
    },
  } as fptfLeg;
}

export function convertJourneyToFPTF(
  journey: Journey,
  id: string
): fptfJourney {
  return {
    type: "journey",
    id: id,
    legs: journey.legs.map((leg) => convertLegToFPTF(leg)),
    ...(journey.fare.tickets.length > 0 && {
      price: convertFareToFPTF(journey.fare),
    }),
  };
}

export function convertLegToFPTF(leg: Leg): fptfLeg {
  let departureTime =
    leg.origin.departureTimeEstimated ||
    leg.origin.departureTimePlanned ||
    leg.origin.departureTimeBaseTimetable;
  let plannedDepartureTime =
    leg.origin.departureTimePlanned || leg.origin.departureTimeBaseTimetable;
  let arrivalTime =
    leg.destination.arrivalTimeEstimated ||
    leg.destination.arrivalTimePlanned ||
    leg.destination.arrivalTimeBaseTimetable;
  let plannedArrivalTime =
    leg.destination.arrivalTimePlanned ||
    leg.destination.arrivalTimeBaseTimetable;

  return {
    type: "leg",
    id: leg.transportation && leg.transportation.id,
    cancelled: leg.isCancelled || false,
    origin: leg.origin && convertLocalityToFPTF(leg.origin, true)[0],
    destination:
      leg.destination && convertLocalityToFPTF(leg.destination, true)[0],
    departure: departureTime,
    plannedDeparture: plannedDepartureTime,
    departureDelay:
      departureTime &&
      plannedDepartureTime &&
      (new Date(departureTime).getTime() -
        new Date(plannedDepartureTime).getTime()) /
        1000,
    departurePlatform: plannedDepartureTime && leg.origin.properties?.platform,
    arrival: arrivalTime,
    plannedArrival: plannedArrivalTime,
    arrivalDelay:
      arrivalTime &&
      plannedArrivalTime &&
      (new Date(arrivalTime).getTime() -
        new Date(plannedArrivalTime).getTime()) /
        1000,
    arrivalPlatform: plannedArrivalTime && leg.destination.properties?.platform,
    stopovers: leg.stopSequence?.map(
      (stop) =>
        ({
          type: "stopover",
          cancelled: stop.isCancelled || false,
          stop: convertLocalityToFPTF(stop, true)[0],
          arrival: stop.arrivalTimeEstimated || stop.arrivalTimePlanned,
          plannedArrival: stop.arrivalTimePlanned,
          arrivalDelay:
            stop.arrivalTimePlanned &&
            stop.arrivalTimeEstimated &&
            (new Date(stop.arrivalTimeEstimated).getTime() -
              new Date(stop.arrivalTimePlanned).getTime()) /
              1000,
          arrivalPlatform: stop.properties?.platform,
          departure: stop.departureTimeEstimated || stop.departureTimePlanned,
          plannedDeparture: stop.departureTimePlanned,
          departureDelay:
            stop.departureTimePlanned &&
            stop.departureTimeEstimated &&
            (new Date(stop.departureTimeEstimated).getTime() -
              new Date(stop.departureTimePlanned).getTime()) /
              1000,
          departurePlatform: stop.properties?.platform,
        } as fptfStopover)
    ),
    ...(leg.coords && {
      polyline: leg.coords,
    }),
    ...((leg.infos || leg.hints) && {
      remarks: [
        ...(leg.infos || [])
          .flatMap((i) => i.infoLinks)
          .map((info) => ({
            type: "info",
            title: info.title,
            subtitle: info.subtitle,
            content: info.content,
          })),
        ...(leg.hints || []).map((hint) => ({
          type: "hint",
          content: hint.content,
        })),
      ],
    }),
    line: {
      type: "line",
      id: leg.transportation.id,
      name: leg.transportation.number,
      properties: leg.transportation.properties,
    } as fptfLine,
    mode: convertModeToFPTF(leg.transportation.product.class),
    subMode: leg.transportation.product.name,
    public: true,
    operator: leg.transportation.operator && {
      type: "operator",
      id: leg.transportation.operator.id,
      name: leg.transportation.operator.name,
    },
  } as fptfLeg;
}

export const convertFareToFPTF = (fare: Fare): fptfPrice => {
  return {
    amount: fare.tickets[0].priceBrutto,
    currency: "EUR",
  };
};

export const convertModeToFPTF = (
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

export const convertFPTFToMode = (mode: fptfMode): TransportationMode[] => {
  switch (mode) {
    case fptfMode.bus:
      return [
        TransportationMode.cityBus,
        TransportationMode.regionalBus,
        TransportationMode.coach,
        TransportationMode.buergerBus,
        TransportationMode.other,
      ];
    case fptfMode.train:
      return [
        TransportationMode.train,
        TransportationMode.commuterRailway,
        TransportationMode.undergroundTrain,
        TransportationMode.cityRail,
        TransportationMode.tram,
        TransportationMode.regionalTrain,
        TransportationMode.nationalTrain,
        TransportationMode.internationalTrain,
        TransportationMode.highSpeedTrain,
        TransportationMode.shuttleTrain,
        TransportationMode.other,
      ];
    case fptfMode.aircraft:
      return [TransportationMode.airplane];
    case fptfMode.gondola:
      return [TransportationMode.cableCar];
    case fptfMode.watercraft:
      return [TransportationMode.boat];
    case fptfMode.taxi:
      return [TransportationMode.transitOnDemand];
    case fptfMode.walking:
      return [TransportationMode.footpath];
    case fptfMode.bicycle:
      return [
        TransportationMode.bikeAndRide,
        TransportationMode.takeYourBikeAlong,
      ];
    case fptfMode.car:
      return [TransportationMode.kissAndRide, TransportationMode.parkAndRide];
  }
};
