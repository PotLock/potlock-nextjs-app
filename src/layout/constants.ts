import { rootPathnames } from "@/navigation";

export const MAIN_NAVIGATION_LINKS = [
  { label: "Projects", url: rootPathnames.PROJECTS, disabled: false },
  { label: "Pots", url: rootPathnames.POTS, disabled: false },
  { label: "Campaigns", url: rootPathnames.CAMPAIGNS },
  { label: "Feed", url: rootPathnames.FEED, disabled: false },
  // { label: "Donors", url: rootPathnames.DONORS, disabled: false },
  { label: "Lists", url: rootPathnames.LIST, disabled: false },
];
