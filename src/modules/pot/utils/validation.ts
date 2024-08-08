export type PotTimingsValidationInputs = {
  application_start_ms: number;
  application_end_ms: number;
  public_round_start_ms: number;
  public_round_end_ms: number;
};

export const isPotApplicationStartBeforeEnd = ({
  application_start_ms = 0,
  application_end_ms = 0,
}: Partial<PotTimingsValidationInputs>) =>
  application_start_ms < application_end_ms;

export const isPotPublicRoundStartBeforeEnd = ({
  public_round_start_ms = 0,
  public_round_end_ms = 0,
}: Partial<PotTimingsValidationInputs>) =>
  public_round_start_ms < public_round_end_ms;
