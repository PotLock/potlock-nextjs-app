import HomeSubPage from "./sub-pages/Home";
import { TabNav } from "./types";
import routesPath from "../core/routes";

const tabRoutes = (accountId: string) =>
  [
    {
      label: "Home",
      id: "home",
      href: `${routesPath.PROJECT}/${accountId}/home`,
      Component: HomeSubPage,
    },
    {
      label: "Pots",
      id: "pots",
      href: `${routesPath.PROJECT}/${accountId}/pots`,
      Component: HomeSubPage,
    },
    {
      label: "Funding Raised",
      id: "funding",
      href: `${routesPath.PROJECT}/${accountId}/funding`,
    },
  ] as TabNav[];

export default tabRoutes;
