export type LayoutTabOption = {
  tag: string;
  href: string;
  isHidden?: boolean;
};

/**
 * @deprecated Use {@link LayoutTabOption} reusing `href` as `id` / `key` prop
 */
export type TabOption = {
  id: string;
  label: string;
  href: string;
};
