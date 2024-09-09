import {
  convertStopEventToFTPF,
  convertLocalityToFTPF,
  EfaClient,
} from "../src";
import { StopEvent } from "../src/types/stopEvent";

(async () => {
  const client = new EfaClient("https://efa.vvo-online.de/std3");

  try {
    const result = await client.getStopEvents(
      "33000001",
      new Date(),
      "departure",
      5,
      true
    );
    console.log("Stop Events for stop 33000001 (Dresden Mitte):");
    console.dir(
      result.map((value) => {
        const fptfLegs = value.stopEvents.map((stopEvent) =>
          convertStopEventToFTPF(stopEvent)
        );

        return {
          location: convertLocalityToFTPF(value.location),
          stopEvents: fptfLegs,
        };
      }),
      { depth: null }
    );
  } catch (error) {
    console.error(error);
  }
})();
