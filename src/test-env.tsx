/**
 *! Note: this module must only be used in tests.
 */

import { render } from "@testing-library/react";
import * as mockRouter from "next-router-mock";
import { Provider } from "react-redux";
import { beforeEach, vi } from "vitest";

import { store } from "./app/_store";

const useRouter = mockRouter.useRouter;

/**
 * https://github.com/scottrippey/next-router-mock/issues/67#issuecomment-1564906960
 */
export const NextNavigationMock = {
  ...mockRouter,
  notFound: vi.fn(),

  redirect: vi.fn().mockImplementation((url: string) => {
    mockRouter.memoryRouter.setCurrentUrl(url);
  }),

  usePathname: () => {
    const router = useRouter();
    return router.asPath;
  },

  useSearchParams: () => {
    const router = useRouter();
    const path = router.query;
    return new URLSearchParams(path as any);
  },
};

export const renderWithStore = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });

beforeEach(() => mockRouter.memoryRouter.setCurrentUrl("/"));
