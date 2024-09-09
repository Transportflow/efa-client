export enum LocalityType {
  any = "any",
  suburb = "suburb",
  stop = "stop",
  street = "street",
  address = "address",
  intersection = "intersection",
  poi = "poi",
  postcode = "postcode",
  singlehouse = "singlehouse",
  platform = "platform",
}

export interface Locality {
  id: string;
  name?: string;
  disassembledName?: string;
  coord?: number[];
  type: LocalityType;
  // key value pairs of additional properties:
  properties?: { [key: string]: string };
  assignedStops?: Locality[];

  // additional properties for stops
  distance?: number;
  duration?: number;
  connectingMode?: number;
  productClasses?: number[];
  parent?: Locality;

  // additional properties for addresses
  streetName?: string;
  buildingNumber?: string;
}
