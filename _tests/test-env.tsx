import * as React from "react";

import { render } from "@testing-library/react";
import * as mockRouter from "next-router-mock";
import { Provider } from "react-redux";
import { beforeEach, vi } from "vitest";

import { store } from "../src/store";

/**
 * https://github.com/scottrippey/next-router-mock/issues/67#issuecomment-1564906960
 */
export const NextNavigationMock = {
  ...mockRouter,
  notFound: vi.fn(),

  redirect: vi.fn().mockImplementation((url: string) => {
    mockRouter.memoryRouter.setCurrentUrl(url);
  }),
};

export const renderWithStore = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

beforeEach(() => mockRouter.memoryRouter.setCurrentUrl("/"));
