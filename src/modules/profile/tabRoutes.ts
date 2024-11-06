import { TabNav } from "./types";

export const tabRoutesProject = [
  {
    label: "Home",
    id: "home",
    href: "/home",
  },
  {
    label: "Feed",
    id: "feed",
    href: "/feed",
  },
  {
    label: "Pots",
    id: "pots",
    href: "/pots",
  },
  {
    label: "Funding Raised",
    id: "funding",
    href: "/funding-raised",
  },
  {
    label: "Donations",
    id: "donations",
    href: "/donations",
  },
  {
    label: "Lists",
    id: "lists",
    href: "/lists",
  },
  {
    label: "Campaigns",
    id: "campaigns",
    href: "/campaigns",
  },
] as TabNav[];

export const tabRoutesProfile = [
  // INFO: It's needed to have home for regular users as well as pages redirection sends user to /home page (check middleware.ts file)
  {
    label: "Home",
    id: "home",
    href: "/home",
  },
  {
    label: "Donations",
    id: "donations",
    href: "/donations",
  },
] as TabNav[];
