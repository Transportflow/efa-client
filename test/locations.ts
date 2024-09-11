import { EfaClient, convertLocalityToFTPF } from "../src";
import { LocalityType } from "../src/types/locality";

(async () => {
  const client = new EfaClient("https://efa.vvo-online.de/std3");

  try {
    const locations = await client
      .locationsWithCoordiantes(
        {
          lat: 51.06316,
          lon: 13.74643,
        },
        "Mein Standort",
        100,
        [LocalityType.stop]
      )
      .then((locations) => {
        return locations.map((location) => convertLocalityToFTPF(location));
      });
    console.log("Location Search Request:");
    console.dir(locations, { depth: null });

    const locations2 = await client
      .locationsWithSearchQuery("TU Hörsaalzentrum", 5, [LocalityType.poi])
      .then((locations) => {
        return locations.map((location) => convertLocalityToFTPF(location));
      });
    console.log("Location Search Request:");
    console.dir(locations2, { depth: null });
  } catch (error) {
    console.error(error);
  }
})();
