export const POT_MIN_NAME_LENGTH = 3;

export const POT_MAX_NAME_LENGTH = 64;

export const POT_MAX_DESCRIPTION_LENGTH = 256;

export const POT_MAX_APPROVED_PROJECTS = 100;

export const POT_MAX_REFERRAL_FEE_MATCHING_POOL_BASIS_POINTS = 1000;

export const POT_MAX_REFERRAL_FEE_PUBLIC_ROUND_BASIS_POINTS = 1000;

export const POT_MAX_CHEF_FEE_BASIS_POINTS = 1000;

export const POT_MIN_COOLDOWN_PERIOD_MS = 604800000;

export const statuses = [
  {
    label: "Application open",
    val: "application_open",
  },
  {
    label: "Matching round open",
    val: "round_open",
  },
  {
    label: "Application closed",
    val: "application_closed",
  },
  {
    label: "Challenge period",
    val: "cooldown",
  },
];

export const sortOptions = [
  {
    label: "Most to least in pot",
    value: "least_pots",
  },
  {
    label: "Least to most in pot",
    value: "most_pots",
  },
  {
    label: "Most to least donations",
    value: "most_donations",
  },
  {
    label: "Least to most donations",
    value: "least_donations",
  },
];
