import { useState } from "react";

import { indexer } from "@/common/api/indexer";

import { PotHistoryCarousel } from "./carousel";
import { PotHistoryTotals } from "./dashboard";
import { HISTORICAL_POTS, POT_SNAPSHOT_DATE } from "./data";
import styles from "./maintenance.module.css";

export const PotArchiveList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = indexer.usePots({ page, page_size: 20 });
  const records = data?.results ?? (page === 1 ? HISTORICAL_POTS : []);
  const showingSnapshot = !data && records.length > 0;
  return (
    <section className={styles.archive} aria-labelledby="pot-archive-title">
      <h2 id="pot-archive-title">Past rounds</h2>
      <PotHistoryTotals />
      <p>
        Read-only round records. Swipe through the carousel and select a Pot to open its historical
        metrics.
      </p>
      {showingSnapshot && (
        <p role="status">
          Showing public contract metadata saved on {POT_SNAPSHOT_DATE} while indexed records are
          unavailable. Contract activity is available through NearBlocks.
        </p>
      )}
      {isLoading && !showingSnapshot && <p role="status">Loading round records…</p>}
      {error && !showingSnapshot && (
        <p role="status">
          Round records are unavailable right now. You can still view the contract code below.
        </p>
      )}
      {!isLoading && !error && data?.results?.length === 0 && <p>No round records found.</p>}
      <PotHistoryCarousel
        records={records.map((pot) => ({
          ...HISTORICAL_POTS.find((saved) => saved.account === pot.account),
          ...pot,
        }))}
      />
      <div className={styles.actions} aria-label="Round record pages">
        <button
          className={`${styles.button} ${styles.secondary}`}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span aria-live="polite">Page {page}</span>
        <button
          className={`${styles.button} ${styles.secondary}`}
          disabled={!data?.next}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
};
