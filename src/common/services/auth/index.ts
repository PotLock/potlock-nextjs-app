import * as authHooks from "./hooks";

export * from "./components/buttons";
export * from "./components/providers";
export * from "./types";

export { authHooks };

//! For backward compatibility only
// TODO: Rewire all the consumer code through `authHooks` namespace instead
//? ( e.g. `authHooks.useWallet()` )
export * from "./hooks/redux-store";
export * from "./hooks/wallet";
