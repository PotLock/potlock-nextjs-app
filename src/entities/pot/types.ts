import { PotId } from "@/common/api/indexer";
import { PotConfig } from "@/common/contracts/core";

export type PotData = { id: PotId } & PotConfig;

export enum PotLifecycleStageTagEnum {
  Application = "Application",
  Matching = "Matching",
  Cooldown = "Cooldown",
  Completed = "Completed",
}

export type PotLifecycleStageTag = keyof typeof PotLifecycleStageTagEnum;

export type PotLifecycleStage = {
  tag: PotLifecycleStageTag;
  started: boolean;
  progress: number;
  completed: boolean;
};
