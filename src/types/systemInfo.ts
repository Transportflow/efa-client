export interface PtKernel {
  appVersion: string;
  dataFormat: string;
  dataBuild: string;
}

export interface Validity {
  from: string;
  to: string;
}

export interface SystemInfo {
  version: string;
  ptKernel: PtKernel;
  validity: Validity;
}
