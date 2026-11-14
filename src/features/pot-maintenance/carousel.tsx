import { useCallback, useEffect, useRef, useState } from "react";

import { PotMaintenanceCard } from "./card";
import type { HistoricalPot } from "./data";
import styles from "./maintenance.module.css";

export const PotHistoryCarousel = ({ records }: { records: HistoricalPot[] }) => {
  const track = useRef<HTMLUListElement>(null);
  const [canPrevious, setCanPrevious] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const measure = useCallback(() => {
    const element = track.current;
    if (!element) return;
    setCanPrevious(element.scrollLeft > 2);
    setCanNext(element.scrollLeft + element.clientWidth < element.scrollWidth - 2);
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure, records.length]);

  const move = (direction: number) => {
    const element = track.current;
    element?.scrollBy({ left: direction * element.clientWidth, behavior: "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Historical Pots">
      <div className={styles.carouselControls}>
        <span>{records.length} Pots · Swipe or use the arrows</span>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          aria-label="Previous Pots"
          disabled={!canPrevious}
          onClick={() => move(-1)}
        >
          ←
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          aria-label="Next Pots"
          disabled={!canNext}
          onClick={() => move(1)}
        >
          →
        </button>
      </div>
      <ul
        className={styles.carouselTrack}
        ref={track}
        onScroll={measure}
        onKeyDown={(event) => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }}
      >
        {records.map((pot, index) => (
          <li
            key={pot.account}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${records.length}`}
          >
            <PotMaintenanceCard pot={pot} />
          </li>
        ))}
      </ul>
    </div>
  );
};
