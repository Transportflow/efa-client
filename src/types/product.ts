export type TransportationProduct = {
  id: number;
  class: TransportationMode;
  name: string;
  imageId: number;
};

export enum TransportationMode {
  train = 0,
  commuterRailway = 1,
  undergroundTrain = 2,
  cityRail = 3,
  tram = 4,
  cityBus = 5,
  regionalBus = 6,
  coach = 7,
  cableCar = 8,
  boat = 9,
  transitOnDemand = 10,
  other = 11,
  airplane = 12,
  regionalTrain = 13,
  nationalTrain = 14,
  internationalTrain = 15,
  highSpeedTrain = 16,
  railReplacementTrain = 17,
  shuttleTrain = 18,
  buergerBus = 19,
  footpath = 100,
  bikeAndRide = 101,
  takeYourBikeAlong = 102,
  kissAndRide = 103,
  parkAndRide = 104,
}

export const TransportationModeNames = [
  "Train",
  "Commuter Railway",
  "Underground Train",
  "City Rail",
  "Tram",
  "City Bus",
  "Regional Bus",
  "Coach",
  "Cable Car",
  "Boat",
  "Transit On Demand",
  "Other",
  "Airplane",
  "Regional Train",
  "National Train",
  "International Train",
  "High Speed Train",
  "Rail Replacement Train",
  "Shuttle Train",
  "Buerger Bus",
  "Footpath",
  "Bike and Ride",
  "Take Your Bike Along",
  "Kiss and Ride",
  "Park and Ride",
];

export const TransportationModesFromName = {
  Train: TransportationMode.train,
  "Commuter Railway": TransportationMode.commuterRailway,
  "Underground Train": TransportationMode.undergroundTrain,
  "City Rail": TransportationMode.cityRail,
  Tram: TransportationMode.tram,
  "City Bus": TransportationMode.cityBus,
  "Regional Bus": TransportationMode.regionalBus,
  Coach: TransportationMode.coach,
  "Cable Car": TransportationMode.cableCar,
  Boat: TransportationMode.boat,
  "Transit On Demand": TransportationMode.transitOnDemand,
  Other: TransportationMode.other,
  Airplane: TransportationMode.airplane,
  "Regional Train": TransportationMode.regionalTrain,
  "National Train": TransportationMode.nationalTrain,
  "International Train": TransportationMode.internationalTrain,
  "High Speed Train": TransportationMode.highSpeedTrain,
  "Rail Replacement Train": TransportationMode.railReplacementTrain,
  "Shuttle Train": TransportationMode.shuttleTrain,
  "Buerger Bus": TransportationMode.buergerBus,
  Footpath: TransportationMode.footpath,
  "Bike and Ride": TransportationMode.bikeAndRide,
  "Take Your Bike Along": TransportationMode.takeYourBikeAlong,
  "Kiss and Ride": TransportationMode.kissAndRide,
  "Park and Ride": TransportationMode.parkAndRide,
};
