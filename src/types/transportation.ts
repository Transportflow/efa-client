import { Locality } from "./locality";
import { TransportationProduct } from "./product";

export type Transportation = {
  id: string;
  name: string;
  disassembledName?: string;
  number: string;
  description: string;
  product: TransportationProduct;
  operator: {
    id: string;
    code: number;
    name: string;
  };
  destination: Locality;
  origin: Locality;
  properties?: {
    trainType?: string;
    trainNumber?: string;
    isSTT?: boolean;
    tripCode?: number;
    globalId?: string;
    OperatorURL?: string;
    [key: string]: string | boolean | number | undefined;
  };
};
