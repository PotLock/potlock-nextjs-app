import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { PotServiceBoundary } from "../src/features/pot-maintenance/boundary";
import { PotHistoryDashboard } from "../src/features/pot-maintenance/dashboard";
import {
  HISTORICAL_POTS,
  formatNear,
  loadCapturedPotHistory,
} from "../src/features/pot-maintenance/data";
import { HistoricalTable } from "../src/features/pot-maintenance/table";

const mocks = vi.hoisted(() => ({ useSWR: vi.fn() }));
vi.mock("swr", () => ({ default: mocks.useSWR }));
vi.mock("@/common/_config", () => ({ NETWORK: "mainnet" }));

vi.mock("@/common/api/indexer", () => ({
  indexer: { usePots: () => ({ data: { results: [] } }) },
}));

vi.mock("next/head", () => ({ default: () => null }));
const account = "marketing.v1.potfactory.potlock.near";

const readHistory = (id: string) =>
  JSON.parse(readFileSync(resolve("public/pot-history", `${id}.json`), "utf8"));

const marketing = readHistory(account);

beforeEach(() =>
  mocks.useSWR.mockReturnValue({ data: marketing, isLoading: false, mutate: vi.fn() }),
);

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("read-only Pot history pages", () => {
  it("opens the historical notice, then reveals metrics and all record sections without mounting transaction pages", async () => {
    const activePage = vi.fn(() => <button>Donate now</button>);

    render(
      <PotServiceBoundary pathname="/pot/[potId]" potId={account} renderActivePage={activePage} />,
    );

    expect(screen.getByRole("dialog").textContent).toContain("historical Pot metrics");
    const explorer = screen.getByRole("link", { name: /View contract on NearBlocks/ });
    expect(explorer.getAttribute("href")).toBe(`https://nearblocks.io/address/${account}`);
    expect(explorer.getAttribute("target")).toBe("_blank");
    fireEvent.click(screen.getByRole("button", { name: "View historical data", exact: true }));
    expect(screen.queryByRole("dialog")).toBeNull();

    await waitFor(() =>
      expect(document.activeElement).toBe(
        screen.getByRole("heading", { name: "NEAR Marketing DAO", level: 1 }),
      ),
    );

    expect(activePage).not.toHaveBeenCalled();

    expect(
      screen.queryByRole("button", { name: /donate|apply|deploy|process payout/i }),
    ).toBeNull();

    expect(screen.getAllByText("Public donations (net NEAR)").length).toBeGreaterThan(0);
    expect(screen.getByText(formatNear(marketing.metrics.publicDonationsNet))).toBeDefined();

    for (const name of [
      "Round overview",
      "Projects & applications",
      "Public donation history",
      "Matching pool sponsors",
      "Matching payouts",
      "Round timeline & contract",
    ]) {
      expect(screen.getByRole("heading", { name, exact: true })).toBeDefined();
    }

    fireEvent.click(screen.getByRole("button", { name: "About this historical view" }));
    expect(screen.getByRole("dialog")).toBeDefined();
  });

  it("paginates historical monthly summaries without leaving the page", () => {
    const rows = Array.from({ length: 25 }, (_, index) => ({ month: `Period ${index + 1}` }));

    render(
      <HistoricalTable
        rows={rows}
        columns={[{ label: "Period", render: (row) => row.month }]}
        label="Donation months"
        rowKey={(row) => row.month}
      />,
    );

    const table = screen.getByRole("table", { name: /^Donation months ·/ });
    expect(within(table).getAllByRole("row")).toHaveLength(21);
    expect(screen.queryByText("Period 21")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Next donation months", exact: true }));
    expect(screen.getByText("Period 21")).toBeDefined();
    expect(within(table).getAllByRole("row")).toHaveLength(6);
    expect(screen.getByLabelText("Donation months pages").textContent).toContain("Page 2 of");
  });

  it("keeps verified summary metrics available when detailed static records fail", () => {
    mocks.useSWR.mockReturnValue({
      error: new Error("offline"),
      isLoading: false,
      mutate: vi.fn(),
    });

    render(<PotHistoryDashboard potId={account} />);
    fireEvent.click(screen.getByRole("button", { name: "View historical data" }));
    expect(screen.getByText(formatNear(marketing.metrics.publicDonationsNet))).toBeDefined();

    expect(screen.getByRole("status").textContent).toContain(
      "Saved summary metrics remain visible",
    );
  });

  it("checks the snapshot account and finalized block before accepting fetched records", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => marketing }));

    await expect(
      loadCapturedPotHistory("/history.json", "other.near", marketing.blockHeight),
    ).rejects.toThrow("do not match");

    await expect(
      loadCapturedPotHistory("/history.json", account, marketing.blockHeight + 1),
    ).rejects.toThrow("do not match");

    await expect(
      loadCapturedPotHistory("/history.json", account, marketing.blockHeight),
    ).resolves.toMatchObject({ account });
  });

  it("reconciles every aggregate period with the summary without publishing individual identities", () => {
    let donations = 0;
    let applications = 0;

    for (const pot of HISTORICAL_POTS) {
      const history = readHistory(pot.account);
      expect(history.account).toBe(pot.account);
      expect(history.blockHeight).toBe(pot.blockHeight);
      expect(history.metrics).toEqual(pot.metrics);

      expect(
        history.donationMonths.reduce((sum: number, row: { count: number }) => sum + row.count, 0),
      ).toBe(history.metrics.publicDonationCount);

      expect(
        history.sponsorshipMonths.reduce(
          (sum: number, row: { count: number }) => sum + row.count,
          0,
        ),
      ).toBe(history.metrics.matchingDonationCount);

      expect(
        history.donationMonths
          .reduce((sum: bigint, row: { net: string }) => sum + BigInt(row.net), 0n)
          .toString(),
      ).toBe(history.metrics.publicDonationsNet);

      expect(
        history.payoutMonths
          .reduce((sum: bigint, row: { amount: string }) => sum + BigInt(row.amount), 0n)
          .toString(),
      ).toBe(history.metrics.payoutsAllocated);

      expect(
        history.applicationStatuses.reduce(
          (sum: number, row: { count: number }) => sum + row.count,
          0,
        ),
      ).toBe(history.metrics.applicants);

      expect(JSON.stringify(history)).not.toMatch(
        /donor_id|project_id|review_notes|deployed_by|"owner"|"admins"/,
      );

      donations += history.metrics.donationCount;
      applications += history.metrics.applicants;
    }

    expect(donations).toBe(4130);
    expect(applications).toBe(241);
    expect(formatNear("123456789012345678901234567890")).toBe("123,456.79");
  });
});
