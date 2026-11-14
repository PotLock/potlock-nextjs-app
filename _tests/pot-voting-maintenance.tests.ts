import { beforeEach, expect, it, vi } from "vitest";

import { POT_MAINTENANCE_MESSAGE } from "../src/common/_config/pot-service";
import { createVotingClient } from "../src/common/contracts/core/voting/client";

const api = vi.hoisted(() => ({
  view: vi.fn(),
  call: vi.fn().mockResolvedValue(true),
  callMultiple: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/common/blockchains/near-protocol/client", () => ({
  contractApi: () => api,
}));

vi.mock("@wpdas/naxios", () => ({ MemoryCache: class {} }));

beforeEach(() => vi.clearAllMocks());

it("blocks Pot voting and batches after a read-only election-type check", async () => {
  api.view.mockResolvedValue({ election_type: { Pot: "custom-factory.near" } });
  const client = createVotingClient("voting.near");

  await expect(client.vote({ election_id: 1, vote: ["project.near", 1] })).rejects.toThrow(
    POT_MAINTENANCE_MESSAGE,
  );

  await expect(client.voteBatch({ election_id: 1, votes: [["project.near", 1]] })).rejects.toThrow(
    POT_MAINTENANCE_MESSAGE,
  );

  expect(api.call).not.toHaveBeenCalled();
  expect(api.callMultiple).not.toHaveBeenCalled();
});

it("preserves voting on a verified non-Pot election", async () => {
  api.view.mockResolvedValue({ election_type: "GeneralElection" });
  await createVotingClient("voting.near").vote({ election_id: 2, vote: ["project.near", 1] });
  expect(api.call).toHaveBeenCalledWith("vote", expect.any(Object));
});

it("does not sign if the election type cannot be verified", async () => {
  api.view.mockResolvedValue(null);

  await expect(
    createVotingClient("voting.near").vote({ election_id: 1, vote: ["project.near", 1] }),
  ).rejects.toThrow("Unable to verify");

  expect(api.call).not.toHaveBeenCalled();
});
