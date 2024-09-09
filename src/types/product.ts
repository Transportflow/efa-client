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
