import { screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithStore } from "./_store/testEnv";
import Homepage from "./page";

test("Homepage", () => {
  renderWithStore(<Homepage />);

  expect(screen.getByText("Donate Randomly")).toBeDefined();
  expect(screen.getByText("Register Your Project")).toBeDefined();
});
