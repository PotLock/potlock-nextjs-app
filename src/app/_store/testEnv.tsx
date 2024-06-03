/**
 *! Note: this module must only be used in tests.
 */

import { render } from "@testing-library/react";
import { Provider } from "react-redux";

import { store } from ".";

export const renderWithStore = (ui: React.ReactElement) =>
  render(ui, {
    wrapper: ({ children }) => <Provider store={store}>{children}</Provider>,
  });
