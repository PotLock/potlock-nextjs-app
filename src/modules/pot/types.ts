import { PotId } from "@/common/api/potlock";
import { PotConfig } from "@/common/contracts/potlock";

export type PotData = { id: PotId } & PotConfig;
