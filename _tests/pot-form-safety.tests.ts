import { beforeEach, describe, expect, it, vi } from "vitest";

import { POT_WRITES_PAUSED_MESSAGE } from "../src/common/contracts/core/pot/safety";
import { useMatchingPoolContributionForm } from "../src/features/matching-pool-contribution/hooks/forms";
import { usePotApplicationForm } from "../src/features/pot-application/hooks/forms";

const mocks = vi.hoisted(() => ({
  setError: vi.fn(),
  contractApi: vi.fn(),
  getDaoPolicy: vi.fn(),
  viewer: { isDaoRepresentative: false, daoAccountId: "dao.near", referrerAccountId: undefined },
}));

vi.mock("react", () => ({ useCallback: (fn: unknown) => fn, useState: () => [false, vi.fn()] }));

vi.mock("react-hook-form", () => ({
  useForm: () => ({ setError: mocks.setError, formState: { errors: {} } }),
}));

vi.mock("@hookform/resolvers/zod", () => ({ zodResolver: () => undefined }));
vi.mock("@wpdas/naxios", () => ({ calculateDepositByDataSize: () => "0.01" }));

vi.mock("@/common/constants", () => ({
  FULL_TGAS: "300000000000000",
  FIFTY_TGAS: "50000000000000",
  ONE_TGAS: { mul: () => "100000000000000" },
  MIN_PROPOSAL_DEPOSIT_FALLBACK: "1",
}));

vi.mock("@/common/blockchains/near-protocol/client", () => ({
  naxiosInstance: { contractApi: mocks.contractApi },
}));

vi.mock("@/common/contracts/sputnik-dao", () => ({ getDaoPolicy: mocks.getDaoPolicy }));
vi.mock("@/common/contracts/core/pot", () => ({ potContractClient: {} }));
vi.mock("@/common/wallet", () => ({ useWalletUserSession: () => mocks.viewer }));

vi.mock("../src/features/pot-application/model/schemas", () => ({
  potApplicationSchema: {},
  potApplicationReviewSchema: {},
}));

vi.mock("../src/features/matching-pool-contribution/model/schemas", () => ({
  matchingPoolFundingSchema: {},
}));

beforeEach(() => vi.clearAllMocks());

describe("wallet and DAO form containment", () => {
  const potDetail = {
    name: "Local test",
    account: "marketing.v1.potfactory.potlock.near",
  } as never;

  it.each([false, true])(
    "blocks applications before wallet/DAO interaction (DAO=%s)",
    async (asDao) => {
      const form = usePotApplicationForm({ accountId: "user.near", potDetail, asDao });
      await form.onSubmit({ data: { message: "test" } } as never);
      expect(mocks.contractApi).not.toHaveBeenCalled();
      expect(mocks.getDaoPolicy).not.toHaveBeenCalled();
      expect(mocks.setError).toHaveBeenCalledWith("root", { message: POT_WRITES_PAUSED_MESSAGE });
    },
  );

  it.each([false, true])(
    "blocks matching contributions before wallet/DAO interaction (DAO=%s)",
    async (asDao) => {
      mocks.viewer.isDaoRepresentative = asDao;
      const form = useMatchingPoolContributionForm({ potDetail });
      await form.onSubmit({ amountNEAR: 1 } as never);
      expect(mocks.contractApi).not.toHaveBeenCalled();
      expect(mocks.getDaoPolicy).not.toHaveBeenCalled();
      expect(mocks.setError).toHaveBeenCalledWith("root", { message: POT_WRITES_PAUSED_MESSAGE });
    },
  );
});
