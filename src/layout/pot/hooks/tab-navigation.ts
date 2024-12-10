import { useCallback, useEffect, useMemo } from "react";

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
  activeTab: PotLayoutTabOption | null;
  navigateToTab: (tag: PotLayoutTabTag) => void;
  orderedTabList: PotLayoutTabOption[];
}

// TODO: Consider extracting this to a reusable abstract hook and applying performance optimizations
export const usePotLayoutTabNavigation = ({ potId }: ByPotId): PotLayoutTabNavigation => {
  const { asPath: currentPath, push: navigateToHref } = useRouter();
  const rootHref = useMemo(() => `${rootPathnames.pot}/${potId}`, [potId]);
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
        href: `${rootHref}/projects`,
        isHidden: hasVoting,
      },

      [PotLayoutTabTag.Applications]: {
        tag: PotLayoutTabTag.Applications,
        href: `${rootHref}/applications`,
      },

      [PotLayoutTabTag.Votes]: {
        tag: PotLayoutTabTag.Votes,
        href: `${rootHref}/votes`,
        isHidden: !hasVoting,
      },

      [PotLayoutTabTag.Donations]: {
        tag: PotLayoutTabTag.Donations,
        href: `${rootHref}/donations`,
        isHidden: hasVoting,
      },

      [PotLayoutTabTag.Sponsors]: {
        tag: PotLayoutTabTag.Sponsors,
        href: `${rootHref}/sponsors`,
      },

      [PotLayoutTabTag.Payouts]: {
        tag: PotLayoutTabTag.Payouts,
        href: `${rootHref}/payouts`,
      },

      [PotLayoutTabTag.Feeds]: {
        tag: PotLayoutTabTag.Feeds,
        href: `${rootHref}/feeds`,
      },

      [PotLayoutTabTag.Settings]: {
        tag: PotLayoutTabTag.Settings,
        href: `${rootHref}/settings`,
      },
    }),

    [hasVoting, rootHref],
  );

  const activeTab: PotLayoutTabOption | null = useMemo(
    () => Object.values(tabRegistry).find(({ href }) => href === currentPath) ?? null,
    [currentPath, tabRegistry],
  );

  const orderedTabList = useMemo(
    () => [
      tabRegistry[defaultTabTag],
      ...Object.values(tabRegistry).filter(({ tag }) => tag !== defaultTabTag),
    ],

    [defaultTabTag, tabRegistry],
  );

  const navigateToTab = useCallback(
    (tag: PotLayoutTabTag) => void navigateToHref(tabRegistry[tag].href),
    [navigateToHref, tabRegistry],
  );

  useEffect(() => {
    if (potId !== undefined && (activeTab === null || currentPath === rootHref))
      navigateToTab(defaultTabTag);
  }, [activeTab, currentPath, defaultTabTag, navigateToTab, potId, rootHref]);

  return { defaultTabTag, activeTab, orderedTabList, navigateToTab };
};
