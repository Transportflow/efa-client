import EfaClient from "../src/efaClient";

(async () => {
  const client = new EfaClient("https://efa.vvo-online.de/std3");

  try {
    const systemInfo = await client.systemInfo();
    console.log("System Info Request:");
    console.log(systemInfo);
  } catch (error) {
    console.error(error);
  }
})();
