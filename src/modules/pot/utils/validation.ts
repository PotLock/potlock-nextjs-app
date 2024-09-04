import {
  POT_MAX_APPROVED_PROJECTS,
  POT_MAX_CHEF_FEE_BASIS_POINTS,
  POT_MAX_REFERRAL_FEE_MATCHING_POOL_BASIS_POINTS,
  POT_MAX_REFERRAL_FEE_PUBLIC_ROUND_BASIS_POINTS,
  POT_MIN_COOLDOWN_PERIOD_MS,
} from "../constants";

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

export const isPotPublicRoundStartAfterApplicationEnd = ({
  application_end_ms = 0,
  public_round_start_ms = 0,
}) => public_round_start_ms > application_end_ms;

export const isPotCooldownPeriodValid = (cooldown_period_ms: number) =>
  cooldown_period_ms >= POT_MIN_COOLDOWN_PERIOD_MS;

export const isPotMaxProjectsValid = (max_projects: number) =>
  max_projects <= POT_MAX_APPROVED_PROJECTS;

export const isPotMatchingPoolReferralFeeValid = (basisPoints: number) =>
  basisPoints <= POT_MAX_REFERRAL_FEE_MATCHING_POOL_BASIS_POINTS;

export const isPotPublicRoundReferralFeeValid = (basisPoints: number) =>
  basisPoints <= POT_MAX_REFERRAL_FEE_PUBLIC_ROUND_BASIS_POINTS;

export const isPotChefFeeValid = (basisPoints: number) =>
  basisPoints <= POT_MAX_CHEF_FEE_BASIS_POINTS;
