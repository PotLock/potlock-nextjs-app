// TODO: Storage optimizations required

import { useCallback, useEffect } from "react";

import { useRouter } from "next/router";
import { pick } from "remeda";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useShallow } from "zustand/react/shallow";

import { ByPotId } from "@/common/api/indexer";
import { LayoutTabOption } from "@/common/ui/layout/types";
import { usePotFeatureFlags } from "@/entities/pot";
import { rootPathnames } from "@/pathnames";

export enum PotLayoutTabTag {
  Projects = "Projects",
  Applications = "Applications",
  Votes = "Votes",
  Donations = "Donations",
  Sponsors = "Sponsors",
  History = "History",
  Payouts = "Payouts",
  Feed = "Feed",
  Settings = "Settings",
}

export type PotLayoutTabOption = LayoutTabOption & {
  tag: PotLayoutTabTag;
};

type PotLayoutTabRegistry = Record<PotLayoutTabTag, PotLayoutTabOption>;

interface TabState {
  potConfigs: Record<string, { hasPFMechanism: boolean; defaultTabTag: PotLayoutTabTag }>;
  tabRegistries: Record<string, PotLayoutTabRegistry>;
  orderedTabLists: Record<string, PotLayoutTabOption[]>;
  setPotConfig: (potId: string, hasPFMechanism: boolean) => void;
  computeTabRegistry: (potId: string) => void;
}

const usePotTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      potConfigs: {},
      tabRegistries: {},
      orderedTabLists: {},

      setPotConfig: (potId: string, hasPFMechanism: boolean) => {
        const defaultTabTag = hasPFMechanism ? PotLayoutTabTag.Votes : PotLayoutTabTag.Projects;

        set((state) => ({
          potConfigs: {
            ...state.potConfigs,
            [potId]: {
              hasPFMechanism,
              defaultTabTag,
            },
          },
        }));

        get().computeTabRegistry(potId);
      },

      computeTabRegistry: (potId: string) => {
        const config = get().potConfigs[potId];
        if (!config) return;

        const { hasPFMechanism, defaultTabTag } = config;
        const rootHref = `${rootPathnames.pot}/${potId}`;

        const registry: PotLayoutTabRegistry = {
          [PotLayoutTabTag.Projects]: {
            tag: PotLayoutTabTag.Projects,
            href: `${rootHref}/projects`,
            isHidden: hasPFMechanism,
          },
          [PotLayoutTabTag.Applications]: {
            tag: PotLayoutTabTag.Applications,
            href: `${rootHref}/applications`,
          },
          [PotLayoutTabTag.Votes]: {
            tag: PotLayoutTabTag.Votes,
            href: `${rootHref}/votes`,
            isHidden: !hasPFMechanism,
          },
          [PotLayoutTabTag.Donations]: {
            tag: PotLayoutTabTag.Donations,
            href: `${rootHref}/donations`,
            isHidden: hasPFMechanism,
          },
          [PotLayoutTabTag.Sponsors]: {
            tag: PotLayoutTabTag.Sponsors,
            href: `${rootHref}/sponsors`,
          },
          [PotLayoutTabTag.History]: {
            tag: PotLayoutTabTag.History,
            href: `${rootHref}/history`,
            isHidden: !hasPFMechanism,
          },
          [PotLayoutTabTag.Payouts]: {
            tag: PotLayoutTabTag.Payouts,
            href: `${rootHref}/payouts`,
          },
          [PotLayoutTabTag.Feed]: {
            tag: PotLayoutTabTag.Feed,
            href: `${rootHref}/feed`,
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

  const { isPotExtensionConfigLoading, hasPFMechanism } = usePotFeatureFlags({
    potId,
  });

  const { setPotConfig, potConfigs, tabRegistries, orderedTabLists } = usePotTabStore(
    useShallow(pick(["setPotConfig", "potConfigs", "tabRegistries", "orderedTabLists"])),
  );

  // Ensure pot config is set/updated
  useEffect(() => {
    if (!isPotExtensionConfigLoading) {
      setPotConfig(potId, hasPFMechanism);
    }
  }, [potId, hasPFMechanism, setPotConfig, isPotExtensionConfigLoading]);

  const defaultTabTag = potConfigs[potId]?.defaultTabTag ?? PotLayoutTabTag.Projects;
  const tabRegistry = potId ? (tabRegistries[potId] ?? emptyRegistry) : emptyRegistry;
  const orderedTabList = potId ? (orderedTabLists[potId] ?? emptyList) : emptyList;

  // Get active tab with proper type safety
  const activeTab =
    Object.values(tabRegistry).find((tab): tab is PotLayoutTabOption => {
      // Compare without query parameters
      const currentPathBase = currentPath.split("?")[0];
      return tab?.href === currentPathBase && !tab.isHidden;
    }) ?? null;

  const navigateToTab = useCallback(
    (tag: PotLayoutTabTag) => {
      const targetTab = tabRegistry[tag];
      const currentPathBase = currentPath.split("?")[0];

      // Only navigate if tab exists, is not hidden, and we're not already on the correct tab
      if (targetTab && !targetTab.isHidden && currentPathBase !== targetTab.href) {
        // Extract query parameters from current URL
        const queryParams = currentPath.includes("?")
          ? currentPath.substring(currentPath.indexOf("?"))
          : "";

        // Append query parameters to the target href
        const targetHref = targetTab.href + queryParams;

        navigateToHref(targetHref);
      }
    },

    [navigateToHref, tabRegistry, currentPath],
  );

  // Handle navigation to default tab
  useEffect(() => {
    const rootPath = `${rootPathnames.pot}/${potId}`;
    const currentPathBase = currentPath.split("?")[0];

    if (potId !== undefined && (activeTab === null || currentPathBase === rootPath)) {
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
