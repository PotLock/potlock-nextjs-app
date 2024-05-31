import { RegistrationStatus } from "@/common/contracts/potlock/interfaces/lists.interfaces";

type StatusConfig = {
  [key in RegistrationStatus]: {
    background: string;
    text: string;
    textColor: string;
    toggleColor: string;
  };
};

const ICONS_ROUTE = "/assets/icons/";

export const statuses: StatusConfig = {
  Approved: {
    background: "",
    text: "",
    textColor: "",
    toggleColor: "",
  },
  Graylisted: {
    background: "#C7C7C7",
    text: "GRAYLISTED: needs further review, unsure if project qualifies on public goods",
    textColor: "#525252",
    toggleColor: "#FFFFFF",
  },
  Rejected: {
    background: "#DD3345",
    text: "REJECTED: this project was denied on public goods registry",
    textColor: "#FEF6EE",
    toggleColor: "#C7C7C7",
  },
  Pending: {
    background: "#F0CF1F",
    text: "PENDING: this project has yet to be approved",
    textColor: "#292929",
    toggleColor: "#7B7B7B",
  },
  Blacklisted: {
    background: "#292929",
    text: "BLACKLISTED:  this project has been removed for violating terms",
    textColor: "#F6F5F3",
    toggleColor: "#C7C7C7",
  },
  Unregistered: {
    background: "#DD3345",
    text: "UNREGISTERED: This account has not registered as a public good",
    textColor: "#F6F5F3",
    toggleColor: "#C7C7C7",
  },
};

export const statusesIcons = {
  Approved: {
    icon: ICONS_ROUTE + "approved-icon.svg",
    color: "#0B7A74",
    background: "#EFFEFA",
  },
  Rejected: {
    icon: ICONS_ROUTE + "rejected-icon.svg",
    color: "#ED464F",
    background: "#FEF3F2",
  },
  Pending: {
    icon: ICONS_ROUTE + "pending-icon.svg",
    color: "#EA6A25",
    background: "#FEF6EE",
  },
  Graylisted: {
    icon: ICONS_ROUTE + "graylisted-icon.svg",
    color: "#fff",
    background: "#7b7b7bd8",
  },
  Blacklisted: {
    icon: ICONS_ROUTE + "blacklisted-icon.svg",
    color: "#fff",
    background: "#292929",
  },
  "Human Verified": {
    icon: "/assets/images/nadabot-icon.png",
    color: "#0B7A74",
    background: "#EFFEFA",
  },
};

export const UNREGISTERED_PROJECT = {
  id: "",
  registrant_id: "",
  list_id: 1,
  status: RegistrationStatus.Unregistered,
  submitted_ms: 0,
  updated_ms: 0,
  admin_notes: null,
  registrant_notes: null,
  registered_by: "",
};
