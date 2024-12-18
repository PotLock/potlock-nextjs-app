import { useCallback, useEffect } from "react";

import { useRouter } from "next/router";
import { pick } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { ByPotId } from "@/common/api/indexer";
import { LayoutTabOption } from "@/common/ui/types";
import { usePotExtensionFlags } from "@/entities/pot";
import { rootPathnames } from "@/pathnames";

export enum PotLayoutTabTag {
  Projects = "Projects",
  Applications = "Applications",
  Votes = "Votes",
  Donations = "Donations",
  Sponsors = "Sponsors",
  History = "History",
  Payouts = "Payouts",
  Feeds = "Feeds",
  Settings = "Settings",
}

export type PotLayoutTabOption = LayoutTabOption & {
  tag: PotLayoutTabTag;
};

type PotLayoutTabRegistry = Record<PotLayoutTabTag, PotLayoutTabOption>;

interface TabState {
  potConfigs: Record<
    string,
    {
      hasVoting: boolean;
      defaultTabTag: PotLayoutTabTag;
    }
  >;
  tabRegistries: Record<string, PotLayoutTabRegistry>;
  orderedTabLists: Record<string, PotLayoutTabOption[]>;
  setPotConfig: (potId: string, hasVoting: boolean) => void;
  computeTabRegistry: (potId: string) => void;
}

const usePotTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      potConfigs: {},
      tabRegistries: {},
      orderedTabLists: {},

      setPotConfig: (potId: string, hasVoting: boolean) => {
        const defaultTabTag = hasVoting ? PotLayoutTabTag.Votes : PotLayoutTabTag.Projects;

        set((state) => ({
          potConfigs: {
            ...state.potConfigs,
            [potId]: {
              hasVoting,
              defaultTabTag,
            },
          },
        }));

        get().computeTabRegistry(potId);
      },

      computeTabRegistry: (potId: string) => {
        const config = get().potConfigs[potId];
        if (!config) return;

        const { hasVoting, defaultTabTag } = config;
        const rootHref = `${rootPathnames.pot}/${potId}`;

        const registry: PotLayoutTabRegistry = {
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
          [PotLayoutTabTag.History]: {
            tag: PotLayoutTabTag.History,
            href: `${rootHref}/history`,
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
        };

        const orderedList = [
          registry[defaultTabTag],
          ...Object.values(registry).filter(({ tag }) => tag !== defaultTabTag),
        ];

        set((state) => ({
          tabRegistries: {
            ...state.tabRegistries,
            [potId]: registry,
          },
          orderedTabLists: {
            ...state.orderedTabLists,
            [potId]: orderedList,
          },
        }));
      },
    }),
    {
      name: "pot-tab-navigation",
      partialize: (state) => ({
        potConfigs: state.potConfigs,
        tabRegistries: state.tabRegistries,
        orderedTabLists: state.orderedTabLists,
      }),
    },
  ),
);

interface PotLayoutTabNavigation {
  defaultTabTag: PotLayoutTabTag;
  activeTab: PotLayoutTabOption | null;
  navigateToTab: (tag: PotLayoutTabTag) => void;
  orderedTabList: PotLayoutTabOption[];
}

const emptyRegistry: Record<PotLayoutTabTag, PotLayoutTabOption> = {} as Record<
  PotLayoutTabTag,
  PotLayoutTabOption
>;

const emptyList: PotLayoutTabOption[] = [];

export const usePotLayoutTabNavigation = ({ potId }: ByPotId): PotLayoutTabNavigation => {
  const { asPath: currentPath, push: navigateToHref } = useRouter();
  const { isPotExtensionConfigLoading, hasVoting } = usePotExtensionFlags({ potId });

  const { setPotConfig, potConfigs, tabRegistries, orderedTabLists } = usePotTabStore(
    useShallow(pick(["setPotConfig", "potConfigs", "tabRegistries", "orderedTabLists"])),
  );

  // Ensure pot config is set/updated
  useEffect(() => {
    if (potId && !isPotExtensionConfigLoading) {
      setPotConfig(potId, hasVoting);
    }
  }, [potId, hasVoting, setPotConfig, isPotExtensionConfigLoading]);

  const potConfig = potId ? potConfigs[potId] : null;
  const defaultTabTag = potConfig?.defaultTabTag ?? PotLayoutTabTag.Projects;

  const tabRegistry = potId ? (tabRegistries[potId] ?? emptyRegistry) : emptyRegistry;
  const orderedTabList = potId ? (orderedTabLists[potId] ?? emptyList) : emptyList;

  // Get active tab with proper type safety
  const activeTab =
    Object.values(tabRegistry).find(
      (tab): tab is PotLayoutTabOption => tab?.href === currentPath && !tab.isHidden,
    ) ?? null;

  const navigateToTab = useCallback(
    (tag: PotLayoutTabTag) => {
      const targetTab = tabRegistry[tag];

      if (potId && targetTab && !targetTab.isHidden) {
        navigateToHref(targetTab.href);
      }
    },
    [navigateToHref, tabRegistry, potId],
  );

  // Handle navigation to default tab
  useEffect(() => {
    const rootPath = potId ? `${rootPathnames.pot}/${potId}` : "";

    if (potId !== undefined && (activeTab === null || currentPath === rootPath)) {
      navigateToTab(defaultTabTag);
    }
  }, [activeTab, currentPath, defaultTabTag, navigateToTab, potId]);

  return {
    defaultTabTag,
    activeTab,
    orderedTabList,
    navigateToTab,
  };
};
