import { PotId } from "@/common/api/indexer";
import { PotConfig } from "@/common/contracts/core";

export type PotData = { id: PotId } & PotConfig;
