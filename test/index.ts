import EfaClient from "../src/efaClient";
import { LocalityType, localityTypeFromString } from "../src/types/locality";

(async () => {
  const client = new EfaClient("https://efa.vvo-online.de/std3");

  try {
    const systemInfo = await client.getSystemInfo();
    console.log("System Info Request:");
    console.log(systemInfo);

    const locations = await client.findLocationsWithCoordiantes(
      {
        lat: 51.06316,
        lon: 13.74643,
      },
      "Mein Standort",
      100,
      [LocalityType.stop]
    );
    console.log("Location Search Request:");
    console.dir(locations, { depth: null });

    const locations2 = await client.findLocationsWithSearchQuery(
      "TU Hörsaalzentrum",
      5
    );
    console.log("Location Search Request:");
    console.dir(locations2, { depth: null });
  } catch (error) {
    console.error(error);
  }
})();
