import { PotId } from "@/common/api/indexer";
import { PotConfig } from "@/common/contracts/potlock";

export type PotData = { id: PotId } & PotConfig;
