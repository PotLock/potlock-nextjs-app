import {
  POT_MAINTENANCE_MESSAGE,
  POT_SERVICE_MODE,
  type PotServiceMode,
} from "@/common/_config/pot-service";

export const PAUSED_POT_FACTORY_ACCOUNT_ID = "v1.potfactory.potlock.near";

export const POT_WRITES_PAUSED_MESSAGE = POT_MAINTENANCE_MESSAGE;

export const arePotWritesPaused = (
  accountId: string,
  mode: PotServiceMode = POT_SERVICE_MODE,
): boolean =>
  mode === "indefinite-maintenance" ||
  accountId === PAUSED_POT_FACTORY_ACCOUNT_ID ||
  accountId.endsWith(`.${PAUSED_POT_FACTORY_ACCOUNT_ID}`);

export const assertPotWritesAvailable = (accountId: string): void => {
  if (arePotWritesPaused(accountId)) {
    throw new Error(POT_WRITES_PAUSED_MESSAGE);
  }
};

/** Keep the underlying API's generic signatures and receiver while guarding every write. */
export const withPotWriteGuard = <T extends object>(api: T, accountId: string): T =>
  new Proxy(api, {
    get(target, property) {
      const value = Reflect.get(target, property);

      if ((property === "call" || property === "callMultiple") && typeof value === "function") {
        return async (...args: unknown[]) => {
          assertPotWritesAvailable(accountId);
          return Reflect.apply(value, target, args);
        };
      }

      return typeof value === "function" ? value.bind(target) : value;
    },
  });
