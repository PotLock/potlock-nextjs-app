import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

describe("historical Pot carousel", () => {
  const pot = {
    account: "marketing.v1.potfactory.potlock.near",
    name: "NEAR Marketing DAO",
    description: "Historical marketing round",
  };

  it("links cards to the local historical metrics page", () => {
    render(<PotMaintenanceCard pot={pot} />);
    const card = screen.getByRole("link", { name: "View NEAR Marketing DAO history" });
    expect(card.getAttribute("href")).toBe("/pot/marketing.v1.potfactory.potlock.near");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(screen.queryByRole("button", { name: /donate|apply|deploy/i })).toBeNull();
  });

  it("shows ten verified historical cards and aggregate metrics when the indexer is offline", () => {
    mocks.usePots.mockReturnValue({ error: new Error("offline"), isLoading: false });
    render(<PotArchiveList />);
    expect(HISTORICAL_POTS).toHaveLength(10);

    expect(
      screen.getByRole("region", { name: "Historical Pots" }).getAttribute("aria-roledescription"),
    ).toBe("carousel");

    for (const record of HISTORICAL_POTS) {
      expect(screen.getByRole("link", { name: `View ${record.name} history` })).toBeDefined();
    }

    expect(screen.getByRole("status").textContent).toContain("saved on");
    expect(screen.getByText("4,130")).toBeDefined();
  });

  it("moves the carousel with arrow controls and keyboard navigation", () => {
    mocks.usePots.mockReturnValue({ error: new Error("offline"), isLoading: false });
    const { container } = render(<PotArchiveList />);
    const track = container.querySelector("ul")!;

    Object.defineProperties(track, {
      clientWidth: { value: 900 },
      scrollWidth: { value: 3200 },
      scrollLeft: { value: 0, writable: true },
    });

    const scrollBy = vi.fn();
    track.scrollBy = scrollBy;
    fireEvent.scroll(track);
    fireEvent.click(screen.getByRole("button", { name: "Next Pots", exact: true }));
    expect(scrollBy).toHaveBeenCalledWith({ left: 900, behavior: "smooth" });
    track.scrollLeft = 900;
    fireEvent.scroll(track);
    fireEvent.click(screen.getByRole("button", { name: "Previous Pots", exact: true }));
    expect(scrollBy).toHaveBeenCalledWith({ left: -900, behavior: "smooth" });
    fireEvent.keyDown(track, { key: "ArrowRight" });
    expect(scrollBy).toHaveBeenLastCalledWith({ left: 900, behavior: "smooth" });
  });

  it("uses indexed records when available", () => {
    mocks.usePots.mockReturnValue({ data: { results: [pot] }, isLoading: false });
    render(<PotArchiveList />);
    expect(screen.getByRole("link", { name: "View NEAR Marketing DAO history" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "View Creatives history" })).toBeNull();
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("uses the correct explorer network and encodes the account path", () => {
    expect(getPotExplorerUrl("pot.testnet", "testnet")).toBe(
      "https://testnet.nearblocks.io/address/pot.testnet",
    );

    expect(getPotExplorerUrl("pot.near", "mainnet")).toBe("https://nearblocks.io/address/pot.near");

    expect(getPotExplorerUrl("pot.near?redirect=evil", "mainnet")).toContain(
      "/address/pot.near%3Fredirect%3Devil",
    );
  });
});
