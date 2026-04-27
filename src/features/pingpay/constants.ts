/**
 * Reserved for future PingPay-related constants.
 * Token gating was previously done here but removed: PingPay's Hosted Checkout
 * accepts whatever NEAR-chain asset symbol you pass; the API surfaces an error
 * if the asset is unsupported. The button now enables for every campaign and
 * defers asset validation to PingPay.
 */
export {};
