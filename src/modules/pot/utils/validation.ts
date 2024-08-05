import { Temporal } from "temporal-polyfill";

export type PotDeploymentTimingValidationInputs = {
  application_start_ms: number;
  application_end_ms: number;
  public_round_start_ms: number;
  public_round_end_ms: number;
};

export const test = ({
  application_start_ms,
  application_end_ms,
  public_round_start_ms,
  public_round_end_ms,
}: PotDeploymentTimingValidationInputs) => {
  const now = Temporal.Now.instant().epochMicroseconds;

  return (
    application_start_ms < now &&
    application_end_ms > now &&
    public_round_start_ms < now &&
    public_round_end_ms > now
  );
};
