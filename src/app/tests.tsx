import { screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithStore } from "./_store/testEnv";
import Homepage from "./page";

test("Homepage", () => {
  renderWithStore(<Homepage />);

  expect(screen.getByText("Donate Randomly")).toBeDefined();

  const firstFoundProjectTitle = screen
    .getAllByTestId("project-card-title")
    .at(0);

  expect(firstFoundProjectTitle?.textContent).toBeTruthy();
});
