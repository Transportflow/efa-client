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

export interface BaseLocality {
  id: string;
  name: string;
  disassembledName: string | null;
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
  properties: { [key: string]: string };
  assignedStops: StopLocality[] | null;
}

export interface StopLocality extends BaseLocality {
  distance: number | null;
  duration: number | null;
  connectingMode: number | null;
  productClasses: number[] | null;
  parent: BaseLocality | null;
}

export interface HouseLocality extends BaseLocality {
  streetName: string | null;
  buildingNumber: string | null;
}

// combining baselocality, stoplocality and houselocality into Locality but with static type checking
export type Locality = BaseLocality | StopLocality | HouseLocality;
