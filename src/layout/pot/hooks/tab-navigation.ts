import { useCallback, useMemo } from "react";

import { useRouter } from "next/router";

import { ByPotId } from "@/common/api/indexer";
import { LayoutTabOption } from "@/common/ui/types";
import { isVotingEnabled } from "@/features/voting";
import { rootPathnames } from "@/pathnames";

export enum PotLayoutTabTag {
  Projects = "Projects",
  Applications = "Applications",
  Votes = "Votes",
  Donations = "Donations",
  Sponsors = "Sponsors",
  Payouts = "Payouts",
  Feeds = "Feeds",
  Settings = "Settings",
}

type PotLayoutTabOption = LayoutTabOption & {
  tag: PotLayoutTabTag;
};

type PotLayoutTabRegistry = Record<PotLayoutTabTag, PotLayoutTabOption>;

interface PotLayoutTabNavigation {
  defaultTabTag: PotLayoutTabTag;
  activeTabHref: LayoutTabOption["href"];
  navigateToTab: (tag: PotLayoutTabTag) => void;
  orderedTabList: PotLayoutTabOption[];
}

export const usePotLayoutTabNavigation = ({ potId }: ByPotId): PotLayoutTabNavigation => {
  const { asPath: currentPath, push: navigateToHref } = useRouter();
  const hasVoting = isVotingEnabled({ potId });

  const defaultTabTag = useMemo(() => {
    if (hasVoting) {
      return PotLayoutTabTag.Votes;
    } else {
      return PotLayoutTabTag.Projects;
    }
  }, [hasVoting]);

  const tabRegistry: PotLayoutTabRegistry = useMemo(
    () => ({
      [PotLayoutTabTag.Projects]: {
        tag: PotLayoutTabTag.Projects,
        href: `${rootPathnames.pot}/${potId}/projects`,
        isHidden: hasVoting,
      },

      [PotLayoutTabTag.Applications]: {
        tag: PotLayoutTabTag.Applications,
        href: `${rootPathnames.pot}/${potId}/applications`,
      },

      [PotLayoutTabTag.Votes]: {
        tag: PotLayoutTabTag.Votes,
        href: `${rootPathnames.pot}/${potId}/votes`,
        isHidden: !hasVoting,
      },

      [PotLayoutTabTag.Donations]: {
        tag: PotLayoutTabTag.Donations,
        href: `${rootPathnames.pot}/${potId}/donations`,
        isHidden: hasVoting,
      },

      [PotLayoutTabTag.Sponsors]: {
        tag: PotLayoutTabTag.Sponsors,
        href: `${rootPathnames.pot}/${potId}/sponsors`,
      },

      [PotLayoutTabTag.Payouts]: {
        tag: PotLayoutTabTag.Payouts,
        href: `${rootPathnames.pot}/${potId}/payouts`,
      },

      [PotLayoutTabTag.Feeds]: {
        tag: PotLayoutTabTag.Feeds,
        href: `${rootPathnames.pot}/${potId}/feeds`,
      },

      [PotLayoutTabTag.Settings]: {
        tag: PotLayoutTabTag.Settings,
        href: `${rootPathnames.pot}/${potId}/settings`,
      },
    }),
    [hasVoting, potId],
  );

  const activeTabHref = useMemo(() => {
    if (currentPath === tabRegistry[defaultTabTag].href) {
      return tabRegistry[defaultTabTag].href;
    }

    const activeTab = Object.values(tabRegistry).find(({ href }) => href === currentPath);
    return activeTab?.href || tabRegistry[defaultTabTag].href;
  }, [currentPath, defaultTabTag, tabRegistry]);

  const orderedTabList = useMemo(
    () => [
      tabRegistry[defaultTabTag],
      ...Object.values(tabRegistry).filter(({ tag }) => tag !== defaultTabTag),
    ],

    [defaultTabTag, tabRegistry],
  );

  const navigateToTab = useCallback(
    (tag: PotLayoutTabTag) => {
      const tabHref = tabRegistry[tag].href;
      navigateToHref(tabHref);
    },
    [navigateToHref, tabRegistry],
  );

  return { defaultTabTag, activeTabHref, orderedTabList, navigateToTab };
};
