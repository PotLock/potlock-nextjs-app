import { screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { renderWithStore } from "./_store/testEnv";
import Homepage from "./page";

// TODO: create separate testing env config and make its variables available globally for all tests
vi.stubEnv("NEXT_PUBLIC_NETWORK", "mainnet");
vi.stubEnv("NEXT_PUBLIC_SOCIAL_DB_CONTRACT_ID", "social.near");

renderWithStore(<Homepage />);

test("Homepage", async () => {
  expect(
    screen.getByText("Donate Randomly"),
    "random donation button",
  ).toBeDefined();

  await waitFor(
    () =>
      expect(
        screen.getAllByTestId("project-card").at(0),
        "project cards loaded",
      ).toBeDefined(),

    { timeout: 2000 },
  );

  const projectTitles = screen.getAllByTestId("project-card-title");

  expect(projectTitles.at(0)?.textContent, "project titles").toBeTruthy();

  const projectFundraisingAmounts = screen.getAllByTestId(
    "project-card-fundraising-amount",
  );

  await waitFor(
    () =>
      expect(
        projectFundraisingAmounts.at(0)?.textContent,
        "project fundraising amounts",
      ).toBeDefined(),

    { timeout: 2000 },
  );
});
