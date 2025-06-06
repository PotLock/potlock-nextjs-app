import { useRef } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import { ScrollArea } from "../atoms/scroll-area";

const DEFAULT_ITEM_HEIGHT = 40;

export type VirtualScrollProps<T> = {
  items: T[];
  ItemComponent: React.FC<{ data: T }>;

  classNames?: {
    root?: string;
  };
};

// TODO: The component is unfinished
export const VirtualScroll = <T extends object>({
  classNames,
  items,
  ItemComponent,
}: VirtualScrollProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => DEFAULT_ITEM_HEIGHT,

    // Get the actual rendered height of the element
    measureElement: (element) => element?.getBoundingClientRect().height || DEFAULT_ITEM_HEIGHT,

    // Pre-render items above and below for smoother scrolling
    overscan: 5,
  });

  return (
    <ScrollArea ref={parentRef} className={classNames?.root}>
      <div className="relative w-full" style={{ height: `${rowVirtualizer.getTotalSize()}px` }}>
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            ref={rowVirtualizer.measureElement}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ItemComponent data={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
