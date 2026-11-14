import { beforeEach, describe, expect, it, vi } from "vitest";

import * as pot from "../src/common/contracts/core/pot/client";
import {
  POT_WRITES_PAUSED_MESSAGE,
  arePotWritesPaused,
  assertPotWritesAvailable,
} from "../src/common/contracts/core/pot/safety";
import * as factory from "../src/common/contracts/core/pot-factory/client";

const mocks = vi.hoisted(() => ({
  call: vi.fn().mockResolvedValue({ id: "new-pot.near" }),
  callMultiple: vi.fn().mockResolvedValue([]),
  view: vi.fn().mockResolvedValue({}),
  factoryId: "v1.potfactory.potlock.near",
}));

vi.mock("@wpdas/naxios", () => ({
  calculateDepositByDataSize: () => "0.01",
  MemoryCache: class {},
}));

vi.mock("@/common/_config", () => ({
  get POT_FACTORY_CONTRACT_ACCOUNT_ID() {
    return mocks.factoryId;
  },
}));

vi.mock("@/common/constants", () => ({ FULL_TGAS: "300000000000000", ONE_HUNDREDTH_NEAR: "1" }));

vi.mock("@/common/blockchains/near-protocol", () => ({
  nearProtocolClient: {
    contractApi: () => mocks,
  },
}));

vi.mock("@/common/blockchains/near-protocol/client", () => ({
  contractApi: () => mocks,
}));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.factoryId = "v1.potfactory.potlock.near";
});

describe("Pot service maintenance", () => {
  it.each([
    "v1.potfactory.potlock.near",
    "marketing.v1.potfactory.potlock.near",
    "creatives.v1.potfactory.potlock.near",
    "future-pot.v1.potfactory.potlock.near",
  ])("pauses the affected namespace: %s", (accountId) => {
    expect(arePotWritesPaused(accountId)).toBe(true);
    expect(() => assertPotWritesAvailable(accountId)).toThrow(POT_WRITES_PAUSED_MESSAGE);
  });

  it.each(["v2.potfactory.potlock.near", "pot.factory.testnet", "donate.potlock.near"])(
    "preserves unrelated contracts: %s",
    (accountId) => expect(arePotWritesPaused(accountId, "active")).toBe(false),
  );

  it("blocks single donations before a wallet request", async () => {
    await expect(pot.donate("marketing.v1.potfactory.potlock.near", {}, "1")).rejects.toThrow(
      POT_WRITES_PAUSED_MESSAGE,
    );

    expect(mocks.call).not.toHaveBeenCalled();
  });

  it("blocks batched donations before a wallet request", async () => {
    await expect(pot.donateBatch("marketing.v1.potfactory.potlock.near", [])).rejects.toThrow(
      POT_WRITES_PAUSED_MESSAGE,
    );

    expect(mocks.callMultiple).not.toHaveBeenCalled();
  });

  it("blocks deployment before quoting a deposit or opening a wallet", async () => {
    await expect(factory.deploy_pot({ pot_args: {} as never })).rejects.toThrow(
      POT_WRITES_PAUSED_MESSAGE,
    );

    expect(mocks.view).not.toHaveBeenCalled();
    expect(mocks.call).not.toHaveBeenCalled();
  });

  it("preserves reads but blocks payout administration during maintenance", async () => {
    const potId = "marketing.v1.potfactory.potlock.near";
    await pot.get_config({ potId });
    await expect(pot.admin_process_payouts({ potId })).rejects.toThrow(POT_WRITES_PAUSED_MESSAGE);
    expect(mocks.view).toHaveBeenCalledWith("get_config", { args: { potId } });
    expect(mocks.call).not.toHaveBeenCalled();
  });

  it("blocks Pot donations regardless of factory namespace", async () => {
    await expect(pot.donate("pot.new-factory.near", {}, "1")).rejects.toThrow(
      POT_WRITES_PAUSED_MESSAGE,
    );

    expect(mocks.call).not.toHaveBeenCalled();
  });
});

it("blocks the generic Pot write API, including future write methods", async () => {
  await expect(pot.contractApi("custom.near").call("apply", { args: {} })).rejects.toThrow(
    POT_WRITES_PAUSED_MESSAGE,
  );

  await expect(pot.contractApi("custom.near").callMultiple([])).rejects.toThrow(
    POT_WRITES_PAUSED_MESSAGE,
  );

  expect(mocks.call).not.toHaveBeenCalled();
  expect(mocks.callMultiple).not.toHaveBeenCalled();
});

it("retains the legacy block even if service is intentionally reopened", () => {
  expect(arePotWritesPaused("marketing.v1.potfactory.potlock.near", "active")).toBe(true);
});
