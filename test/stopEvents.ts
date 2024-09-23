import {
  convertStopEventToFTPF,
  convertLocalityToFTPF,
  EfaClient,
} from "../src";
import { StopEvent } from "../src/types/stopEvent";

(async () => {
  const client = new EfaClient("https://efa.vvo-online.de/std3");

  try {
    const result = await client.stopEvents(
      "de:14612:33",
      new Date(),
      "departure",
      10,
      false
    );
    console.log("Stop Events:");
    console.dir(result, { depth: null });
  } catch (error) {
    console.error(error);
  }
})();
