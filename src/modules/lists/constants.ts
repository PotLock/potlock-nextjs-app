import { ICONS_ASSET_ENDPOINT_URL } from "@/common/constants";

import { ListRegistrationStatusMap } from "./types";

export const listRegistrationStatuses: ListRegistrationStatusMap = {
  Approved: {
    icon: `${ICONS_ASSET_ENDPOINT_URL}/approved-icon.svg`,
    color: "#0B7A74",
    background: "#EFFEFA",
  },

  Rejected: {
    icon: `${ICONS_ASSET_ENDPOINT_URL}/rejected-icon.svg`,
    color: "#ED464F",
    background: "#FEF3F2",
  },

  Pending: {
    icon: `${ICONS_ASSET_ENDPOINT_URL}/pending-icon.svg`,
    color: "#EA6A25",
    background: "#FEF6EE",
  },

  Graylisted: {
    icon: `${ICONS_ASSET_ENDPOINT_URL}/graylisted-icon.svg`,
    color: "#fff",
    background: "#7b7b7bd8",
  },

  Blacklisted: {
    icon: `${ICONS_ASSET_ENDPOINT_URL}/blacklisted-icon.svg`,
    color: "#fff",
    background: "#292929",
  },

  Unregistered: {
    icon: `${ICONS_ASSET_ENDPOINT_URL}/graylisted-icon.svg`,
    color: "#F6F5F3",
    background: "#DD3345",
  },

  Human: {
    icon: `${ICONS_ASSET_ENDPOINT_URL}/nadabot-icon.png`,
    color: "#0B7A74",
    background: "#EFFEFA",
  },
};
