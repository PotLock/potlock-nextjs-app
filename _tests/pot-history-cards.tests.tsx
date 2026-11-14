import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { PotArchiveList } from "../src/features/pot-maintenance/archive";
import {
  HISTORICAL_POTS,
  PotMaintenanceCard,
  getPotExplorerUrl,
} from "../src/features/pot-maintenance/card";

const mocks = vi.hoisted(() => ({ usePots: vi.fn() }));
vi.mock("@/common/_config", () => ({ NETWORK: "mainnet" }));
vi.mock("@/common/api/indexer", () => ({ indexer: mocks }));

afterEach(cleanup);

describe("historical Pot cards during maintenance", () => {
  const pot = {
    account: "marketing.v1.potfactory.potlock.near",
    name: "NEAR Marketing DAO",
    description: "Historical marketing round",
  };

  it("opens a maintenance dialog without navigating and links the exact account in a new tab", async () => {
    const initialUrl = window.location.href;
    render(<PotMaintenanceCard pot={pot} />);
    const card = screen.getByRole("button", { name: "View NEAR Marketing DAO history" });
    card.focus();
    fireEvent.click(card);

    expect(screen.getByRole("dialog").textContent).toContain("Pots are under maintenance");
    expect(window.location.href).toBe(initialUrl);
    const link = screen.getByRole("link", { name: /View contract on NearBlocks/ });

    expect(link.getAttribute("href")).toBe(
      "https://nearblocks.io/address/marketing.v1.potfactory.potlock.near",
    );

    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    expect(screen.queryByRole("button", { name: /donate|apply|deploy/i })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Close", exact: true }));
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(document.activeElement).toBe(card));
  });

  it("shows all verified mainnet cards when the indexer is offline", () => {
    mocks.usePots.mockReturnValue({ error: new Error("offline"), isLoading: false });
    render(<PotArchiveList />);
    expect(HISTORICAL_POTS).toHaveLength(10);

    for (const record of HISTORICAL_POTS) {
      expect(screen.getByRole("button", { name: `View ${record.name} history` })).toBeDefined();
    }

    expect(screen.getByRole("status").textContent).toContain("saved on");
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("uses indexed historical records when available, including other factory accounts", () => {
    mocks.usePots.mockReturnValue({ data: { results: [pot] }, isLoading: false });
    render(<PotArchiveList />);
    expect(screen.getByRole("button", { name: "View NEAR Marketing DAO history" })).toBeDefined();
    expect(screen.queryByRole("button", { name: "View Creatives history" })).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("uses the correct explorer network and keeps account IDs inside the address path", () => {
    expect(getPotExplorerUrl("pot.testnet", "testnet")).toBe(
      "https://testnet.nearblocks.io/address/pot.testnet",
    );

    expect(getPotExplorerUrl("pot.near", "mainnet")).toBe("https://nearblocks.io/address/pot.near");

    expect(getPotExplorerUrl("pot.near?redirect=evil", "mainnet")).toContain(
      "/address/pot.near%3Fredirect%3Devil",
    );
  });
});
