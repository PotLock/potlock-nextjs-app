import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  POT_CONTRACT_SOURCES,
  POT_MAINTENANCE_MESSAGE,
  isPotServiceRoute,
} from "../src/common/_config/pot-service";
import { PotServiceBoundary } from "../src/features/pot-maintenance/boundary";
import { PotMaintenancePage } from "../src/features/pot-maintenance/page";

const data = vi.hoisted(() => ({
  usePot: vi.fn(),
  usePots: vi.fn(),
  usePotDonations: vi.fn(),
}));

vi.mock("@/common/api/indexer", () => ({ indexer: data }));
vi.mock("next/head", () => ({ default: () => null }));

beforeEach(() => {
  data.usePot.mockReturnValue({ error: new Error("offline"), isLoading: false });
  data.usePots.mockReturnValue({ data: { results: [] }, isLoading: false });
  data.usePotDonations.mockReturnValue({ data: [], isLoading: false });
});

describe("Pot maintenance boundary", () => {
  it.each([
    "/pots",
    "/deploy",
    "/pot",
    "/pot/[potId]",
    ...[
      "projects",
      "applications",
      "donations",
      "history",
      "payouts",
      "settings",
      "sponsors",
      "votes",
      "feed",
    ].map((tab) => `/pot/test.near/${tab}`),
    "/pot/test.near/votes?done=true&transactionHashes=abc",
    "/pots/",
  ])("renders maintenance before mounting active route: %s", (pathname) => {
    const renderActivePage = vi.fn(() => <button>Submit transaction</button>);

    const html = renderToStaticMarkup(
      <PotServiceBoundary pathname={pathname} renderActivePage={renderActivePage} />,
    );

    expect(html).toContain(
      pathname.replace(/\/+$/, "") === "/pots" ? "Explore past Pots" : "Pots are out of service",
    );

    expect(html).toContain(POT_MAINTENANCE_MESSAGE);
    expect(html).not.toContain("Submit transaction");
    expect(html).not.toContain("Transaction sent successfully");
    expect(renderActivePage).not.toHaveBeenCalled();
  });

  it.each(["/", "/campaign/1", "/lists", "/profile/user.near/pots", "/pots/history", "/pottery"])(
    "preserves unrelated/history route: %s",
    (pathname) => {
      expect(isPotServiceRoute(pathname)).toBe(false);
      const renderActivePage = vi.fn(() => <p>Existing page</p>);

      expect(
        renderToStaticMarkup(
          <PotServiceBoundary pathname={pathname} renderActivePage={renderActivePage} />,
        ),
      ).toContain("Existing page");

      expect(renderActivePage).toHaveBeenCalledOnce();
    },
  );

  it("keeps maintenance and public code links usable when the indexer is offline", () => {
    const html = renderToStaticMarkup(<PotMaintenancePage potId="unknown.near" />);
    expect(html).toContain("This round record is unavailable");
    expect(html).toContain("There is no scheduled reopening date");
    expect(html).toContain('href="/pots/history"');
    for (const source of POT_CONTRACT_SOURCES) expect(html).toContain(source.href);
    expect(html).not.toContain("private-security");
    expect(html).not.toContain("Sign In");
  });

  it("renders archive records without transaction actions", () => {
    data.usePots.mockReturnValue({
      data: {
        results: [
          {
            account: "example.near",
            name: "Example round",
            matching_round_end: "2024-04-01T00:00:00Z",
          },
        ],
      },
    });

    const html = renderToStaticMarkup(<PotMaintenancePage history />);
    expect(html).toContain("Example round");
    expect(html).toContain("Read-only");
    expect(html).not.toContain("Donate to Projects");
    expect(html).not.toContain("Deploy Pot");
  });
});
