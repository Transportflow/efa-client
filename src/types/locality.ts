export enum LocalityType {
  any = 0,
  suburb = 1,
  stop = 1 << 1,
  street = 1 << 2,
  address = 1 << 3,
  intersection = 1 << 4,
  poi = 1 << 5,
  postcode = 1 << 6,
}

// create a function on LocalityType to convert a string to a LocalityType
export function localityTypeFromString(type: string): LocalityType {
  switch (type) {
    case "any":
      return LocalityType.any;
    case "suburb":
      return LocalityType.suburb;
    case "stop":
      return LocalityType.stop;
    case "street":
      return LocalityType.street;
    case "address":
      return LocalityType.address;
    case "intersection":
      return LocalityType.intersection;
    case "poi":
      return LocalityType.poi;
    case "postcode":
      return LocalityType.postcode;
    default:
      throw new Error(`Unknown locality type: ${type}`);
  }
}

export interface Locality {
  id: string;
  name: string;
  disassembledName?: string;
  coord: number[];
  type:
    | "stop"
    | "poi"
    | "address"
    | "street"
    | "locality"
    | "suburb"
    | "postcode"
    | "intersection"
    | "singlehouse";
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
