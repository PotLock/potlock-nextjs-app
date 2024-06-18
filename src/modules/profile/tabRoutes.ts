import HomeSubPage from "./sub-pages/Home";
import { TabNav } from "./types";

const tabRoutes = [
  {
    label: "Home",
    id: "home",
    Component: HomeSubPage,
  },
  {
    label: "Pots",
    id: "pots",
    Component: HomeSubPage,
  },
  {
    label: "Funding Raised",
    id: "funding",
  },
] as TabNav[];

export default tabRoutes;
