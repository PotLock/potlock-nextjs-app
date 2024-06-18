import HomeSubPage from "./sub-pages/Home";
import PotsSubPage from "./sub-pages/Pots";
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
    Component: PotsSubPage,
  },
  {
    label: "Funding Raised",
    id: "funding",
  },
] as TabNav[];

export default tabRoutes;
