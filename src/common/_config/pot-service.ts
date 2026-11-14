export type PotServiceMode = "active" | "indefinite-maintenance";

// Reopening requires a reviewed release; browser state and round dates cannot change this.
export const POT_SERVICE_MODE: PotServiceMode = "indefinite-maintenance";
export const POTS_IN_MAINTENANCE = POT_SERVICE_MODE === "indefinite-maintenance";

export const POT_MAINTENANCE_MESSAGE =
  "Pots are under maintenance indefinitely. Donations through Pots, applications, " +
  "round creation and other Pot transactions are unavailable in this app. " +
  "There is no scheduled reopening date.";

export const isPotServiceRoute = (pathname: string): boolean => {
  const path = pathname.split(/[?#]/)[0].replace(/\/+$/, "");
  return path === "/pots" || path === "/deploy" || path === "/pot" || path.startsWith("/pot/");
};

export const POT_SOURCE_COMMIT = "7ffcf91ed26cd1c920263fb363f691f462f90958";

export const POT_CONTRACT_SOURCES = [
  { name: "Pot contract", path: "contracts/pot", description: "Funding round contract" },
  { name: "PotFactory", path: "contracts/pot_factory", description: "Round deployment contract" },
].map((source) => ({
  ...source,
  href: `https://github.com/PotLock/core/tree/${POT_SOURCE_COMMIT}/${source.path}`,
}));
