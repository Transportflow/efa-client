export interface SystemMessage {
  code: number;
  error?: string;
  text?: string;
  type: "error" | "warning";
  module: string;
}
