import EfaClient from "../src/efaClient";
import { convertJourneyToFPTF } from "../src/utils/fptfConverter";

(async () => {
  const client = new EfaClient("https://efa.vvo-online.de/std3");

  try {
    const trips = await client.trips("de:14612:21", "Berlin", undefined, {
      generateCoordinatePaths: false,
      generateTurnByTurnInstructions: false,
      when: new Date(),
      useWhenAs: "departure",
      numberOfTrips: 1,
      maxChanges: 9,
      routeType: "leasttime",
      includedMeans: [],
      excludedMeans: [],
    });
    console.log("Trip Request:");
    console.dir(
      trips, //.map((t, i) => convertJourneyToFPTF(t, i.toString())),
      { depth: null }
    );
  } catch (error) {
    console.error(error);
  }
})();
