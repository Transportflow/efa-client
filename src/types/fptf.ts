export type fptfLocation = {
  type: "location";
  id: string;
  name?: string; // optional
  address?: string; // optional

  longitude?: number; // optional
  latitude?: number; // optional
};

export type fptfStation = {
  type: "station";
  id: string;
  name: string;
  location?: fptfLocation;
  properties?: { [key: string]: string };
};

export type fptfStop = {
  type: "stop";
  id: string;
  station: string | fptfStation;
  name: string;
  location?: fptfLocation;
  properties?: { [key: string]: string };
};

export type fptfLine = {
  type: "line"; // required
  id: string; // unique, required
  name: string; // official non-abbreviated name, required
  mode: fptfMode; // see section on modes, required
  subMode?: string; // reserved for future use
  routes?: fptfRoute[]; // array of route ids or route objects
  operator: fptfOperator; // operator id or operator object
  properties?: { [key: string]: string };
};

export type fptfRoute = {
  type: "route"; // required
  id: string; // unique, required
  line: fptfLine; // line id or line object, required,
  mode: fptfMode; // see section on modes, overrides `line` mode, e.g. for replacements services
  subMode?: string; // reserved for future use
  stops: fptfStation[] | fptfStop[];
  properties?: { [key: string]: string };
};

export type fptfSchedule = {
  type: "schedule"; // required
  id: string; // unique, required
  route: fptfRoute; // route id or object, required
  mode: fptfMode; // see section on modes, overrides `route`/`line` mode, e.g. for replacements services
  subMode?: string; // reserved for future use
  // seconds relative to departure at first station/stop
  // in 1-to-1 relation to `route` stops
  // The departure at the first stop must be 0.
  // The arrival at the last stop is required.
  sequence: { arrival: number; departure: number }[];
  starts: number[]; // array of Unix timestamps for start time of the trip
  properties?: { [key: string]: string };
};

export type fptfOperator = {
  type: "operator"; // required
  id: string; // unique, required
  name: string; // official non-abbreviated name, required
};

export type fptfStopover = {
  type: "stopover";

  cancelled: boolean; // required

  // - stop/station id or object
  // - required
  stop: string | fptfStation | fptfStop;

  // - ISO 8601 string (with stop/station timezone)
  // - required if `departure` is null
  arrival: string;

  plannedArrival: string; // ISO 8601 string (with stop/station timezone), required

  // - seconds relative to scheduled arrival
  // - optional
  arrivalDelay?: number;

  arrivalPlatform?: string; // string, optional

  // - ISO 8601 string (with stop/station timezone)
  // - required if `arrival` is null
  departure: string;

  plannedDeparture: string; // ISO 8601 string (with stop/station timezone), required

  // - seconds relative to scheduled departure
  // - optional
  departureDelay?: number;

  departurePlatform?: string; // string, optional
  properties?: { [key: string]: string };
};

export type fptfJourney = {
  type: "journey"; // required
  id: string; // unique, required
  legs: fptfLeg[];
  price?: fptfPrice;
  properties?: { [key: string]: string };
};

export type fptfLeg = {
  type: "leg"; // required
  id: string; // unique, optional

  cancelled: boolean; // required

  // - station/stop/location id or object
  // - required
  origin: string | fptfStation | fptfStop | fptfLocation;

  // station/stop/location id or object
  // - required
  destination: string | fptfStation | fptfStop | fptfLocation;

  // - ISO 8601 string (with stop/station timezone)
  // - required if `arrival` is `null`
  // - realtime/prognosis data if available, otherwise plan data, otherwise `null`
  departure: string | null;

  // - ISO 8601 string (with stop/station timezone)
  // - plan data if available, otherwise `null`
  plannedDeparture: string | null;

  // - if realtime/prognosis & plan data is available
  //   - required
  //   - value must be `arrival - plannedArrival` in seconds
  // - otherwise optional
  departureDelay: number;

  departurePlatform: string; // string, optional

  // - ISO 8601 string (with stop/station timezone)
  // - required if `departure` is `null`
  // - realtime/prognosis data if available, otherwise plan data, otherwise `null`
  arrival: string | null;

  // - ISO 8601 string (with stop/station timezone)
  // - plan data if available, otherwise `null`
  plannedArrival: string | null;

  // - if realtime/prognosis & plan data is available
  //   - required
  //   - value must be `arrival - plannedArrival` in seconds
  // - otherwise optional
  arrivalDelay?: number;

  arrivalPlatform?: string; // string, optional

  // - array of stopover objects
  // - optional
  stopovers?: fptfStopover[];

  line?: fptfLine; // line object

  // - schedule id or object
  // - optional
  schedule?: fptfSchedule;

  // - see section on modes
  // - overrides `schedule`'s `mode`
  mode?: fptfMode;

  subMode?: string; // reserved for future use

  public: boolean; // is it publicly accessible?

  // - operator id or object
  // - overrides `schedule`'s `operator`
  operator: string | fptfOperator;

  // use this if pricing information is available for specific legs
  price?: fptfPrice;
  properties?: { [key: string]: string };
};

export type fptfPrice = {
  amount: number; // required
  currency: string; // required
};

export enum fptfMode {
  train = "train",
  bus = "bus",
  watercraft = "watercraft",
  taxi = "taxi",
  gondola = "gondola",
  aircraft = "aircraft",
  car = "car",
  bicycle = "bicycle",
  walking = "walking",
}
