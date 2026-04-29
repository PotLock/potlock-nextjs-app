/**
 * PingPay routes USDC donations through this NEAR Intents-wrapped USDC token
 * contract. Used to pre-check / register recipient storage on the FT contract
 * so PingPay donations don't get refunded.
 */
export const PINGPAY_USDC_TOKEN_CONTRACT_ID =
  "17208628f84f5d6ad33f0da3bbbeb27ffcb398eac501a31bd6ad2011e36133a1";
