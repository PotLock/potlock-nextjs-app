import * as React from "react";

import { screen, waitFor } from "@testing-library/react";
import { expect, test, vi } from "vitest";

import { renderWithStore } from "./test-env";
import Homepage from "../src/pages";

// The donation entry point should not depend on a live indexer response in a unit test.
vi.mock("@/common/api/indexer", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/common/api/indexer")>();
  return {
    ...actual,
    indexer: {
      ...actual.indexer,
      useRandomListRegistration: () => ({
        isLoading: false,
        data: { registrant: { id: "project.near" } },
        mutate: vi.fn(),
      }),
    },
  };
});

// JSDOM does not implement browser APIs used by embla-carousel
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
  takeRecords: vi.fn().mockReturnValue([]),
}));

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.mock("next/navigation", async () => {
  const mockRouter = await import("next-router-mock");

  return {
    ...mockRouter,
    notFound: vi.fn(),
    redirect: vi.fn().mockImplementation((url: string) => {
      mockRouter.memoryRouter.setCurrentUrl(url);
    }),
  };
});

vi.mock("next/router", async () => {
  const mockRouter = await import("next-router-mock");

  return {
    ...mockRouter,
    useRouter: mockRouter.useRouter,
  };
});

test("Homepage", async () => {
  renderWithStore(<Homepage />);

  await waitFor(
    () => expect(screen.getByText("Donate Randomly"), "random donation button").toBeDefined(),

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
