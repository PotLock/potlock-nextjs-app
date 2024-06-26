import { screen, waitFor } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithStore } from "./_store/testEnv";
import Homepage from "./page";

renderWithStore(<Homepage />);

test("Homepage", async () => {
  await waitFor(
    () =>
      expect(
        screen.getByText("Donate Randomly"),
        "random donation button",
      ).toBeDefined(),

    { timeout: 5000 },
  );

  // await waitFor(
  //   () =>
  //     expect(
  //       screen.getAllByTestId("project-card").at(0),
  //       "project cards loaded",
  //     ).toBeDefined(),

  //   { timeout: 5000 },
  // );

  // const projectTitles = screen.getAllByTestId("project-card-title");

  // expect(projectTitles.at(0)?.textContent, "project titles").toBeTruthy();

  // const projectFundraisingAmounts = screen.getAllByTestId(
  //   "project-card-fundraising-amount",
  // );

  // await waitFor(
  //   () =>
  //     expect(
  //       projectFundraisingAmounts.at(0)?.textContent,
  //       "project fundraising amounts",
  //     ).toBeTruthy(),

  //   { timeout: 5000 },
  // );
});
