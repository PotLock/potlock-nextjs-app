export type RoutableTabListOption = {
  label: string;
  href: string;
  isHidden?: boolean;
};

/**
 * @deprecated Use {@link RoutableTabListOption} reusing `href` as `id` / `key` prop
 */
export type TabOption = {
  id: string;
  label: string;
  href: string;
};
