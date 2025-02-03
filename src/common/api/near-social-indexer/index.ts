import * as nearSocialIndexerHooks from "./hooks";

export type * from "./hooks";

export { nearSocialIndexerClient } from "./client";
export { nearSocialIndexerHooks };

// TODO: Move this entire module to `@/common/contracts/social`!
export * from "./queries";
