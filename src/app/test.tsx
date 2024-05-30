import { screen } from "@testing-library/react";
import { expect, test } from "vitest";

import { renderWithStore } from "./_store/testEnv";
import Homepage from "./page";

test("Homepage", () => {
  renderWithStore(<Homepage />);
  // Example:
  // expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
