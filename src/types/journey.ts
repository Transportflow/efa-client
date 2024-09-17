import { ICSInfo } from "./icsInfo";
import { Locality } from "./locality";
import { Transportation } from "./transportation";

export type Journey = {
  rating: number;
  isAddition: boolean;
  interchanges: number;
  legs: Leg[];
  fare: Fare;
};

export type Leg = {
  duration: number;
  isCancelled?: boolean;
  distance?: number;
  isRealtimeControlled?: boolean;
  realtimeStatus?: string[];
  origin: Locality & {
    departureTimeBaseTimetable?: string;
    departureTimePlanned?: string;
    departureTimeEstimated?: string;
  };
  destination: Locality & {
    arrivalTimeBaseTimetable?: string;
    arrivalTimePlanned?: string;
    arrivalTimeEstimated?: string;
  };
  transportation: Transportation;
  stopSequence?: (Locality & {
    isCancelled?: boolean;
    arrivalTimePlanned?: string;
    arrivalTimeEstimated?: string;
    departureTimePlanned?: string;
    departureTimeEstimated?: string;
  })[];
  coords?: number[][];
  pathDescriptions: {
    turnDirection: "LEFT" | "RIGHT" | "STRAIGHT" | "UNKNOWN";
    manoeuvre: string;
    name: string;
    coord: number[];
    skyDirection: number;
    duration: number;
    distance: number;
    fromCoordsIndex: number;
    toCoordsIndex: number;
    properties?: {
      [key: string]: string;
    };
  }[];
  footPathInfo?: {
    position: string;
    duration: number;
    footPathElem: {
      description: string;
      type: "STAIRS" | "RAMP" | "ESCALATOR" | "ELEVATOR" | "LEVEL";
      level: "LEVEL" | "UP" | "DOWN";
      origin: Locality;
      destination: Locality;
    }[];
  }[];
  infos?: ICSInfo[];
  hints?: {
    content: string;
  }[];
  properties?: {
    [key: string]: string | boolean | number | object | undefined;
  };
};

export type Fare = {
  tickets: {
    id?: string;
    name: string;
    comment?: string;
    URL?: string;
    currency: string;
    priceLevel: string;
    priceLevelUnit: string;
    priceBrutto: number;
    priceNetto: number;
    taxPercent: number;
    fromLeg: number;
    toLeg: number;
    net: string; // network
    person: string;
    travellerClass: string;
    timeValidity: string;
    validMinutes?: number;
    validityExtent: string;
    isShortHaul: string;
    returnsAllowed: string;
    validForOneJourneyOnly: string;
    validForOneOperatorOnly: string;
    isSupplement: string;
    numberOfChanges: number;
    nameValidityArea: string;
    properties?: any;
  }[];
  zones: {
    net: string;
    fromLeg: number;
    toLeg: number;
    neutralZone: string;
    zones: { id: string }[];
  }[];
};
