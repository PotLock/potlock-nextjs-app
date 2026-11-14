import { useState } from "react";

import Link from "next/link";

import { indexer } from "@/common/api/indexer";

import styles from "./maintenance.module.css";

const displayDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Unknown" : date.toISOString().slice(0, 10);
};

export const PotArchiveList = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = indexer.usePots({ page, page_size: 20 });
  return (
    <section className={styles.archive} aria-labelledby="pot-archive-title">
      <h2 id="pot-archive-title">Past rounds</h2>
      <p>Read-only round records. Pot transactions are unavailable in this app.</p>
      {isLoading && <p role="status">Loading round records…</p>}
      {error && (
        <p role="status">
          Round records are unavailable right now. You can still view the contract code below.
        </p>
      )}
      {!isLoading && !error && data?.results?.length === 0 && <p>No round records found.</p>}
      <ul className={styles.rounds}>
        {data?.results?.map((pot) => (
          <li key={pot.account}>
            <Link href={`/pot/${pot.account}`}>{pot.name}</Link>
            <p>
              {pot.account} · Round end: {displayDate(pot.matching_round_end)} · Read-only
            </p>
          </li>
        ))}
      </ul>
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

export const PotArchiveDetails = ({ potId }: { potId: string }) => {
  const { data: pot, isLoading, error } = indexer.usePot({ potId });
  return (
    <section className={styles.archive} aria-labelledby="pot-record-title">
      <h2 id="pot-record-title">Round record</h2>
      <p>{potId} · Read-only</p>
      {isLoading && <p role="status">Loading round record…</p>}
      {!isLoading && (error || !pot) && (
        <p role="status">
          This round record is unavailable. You can still view past rounds and the contract source.
        </p>
      )}
      {pot && (
        <>
          <h3>{pot.name}</h3>
          <p>{pot.description}</p>
          <dl className={styles.details}>
            <div>
              <dt>Applications opened</dt>
              <dd>{displayDate(pot.application_start)}</dd>
            </div>
            <div>
              <dt>Applications closed</dt>
              <dd>{displayDate(pot.application_end)}</dd>
            </div>
            <div>
              <dt>Matching round opened</dt>
              <dd>{displayDate(pot.matching_round_start)}</dd>
            </div>
            <div>
              <dt>Matching round ended</dt>
              <dd>{displayDate(pot.matching_round_end)}</dd>
            </div>
            <div>
              <dt>Recorded matching pool balance (yoctoNEAR)</dt>
              <dd>{pot.matching_pool_balance}</dd>
            </div>
            <div>
              <dt>Recorded payout status</dt>
              <dd>{pot.all_paid_out ? "Marked paid out" : "Not marked paid out"}</dd>
            </div>
          </dl>
          <PotArchiveDonations potId={potId} />
        </>
      )}
    </section>
  );
};

const PotArchiveDonations = ({ potId }: { potId: string }) => {
  const [page, setPage] = useState(1);
  const { data, isLoading, error } = indexer.usePotDonations({ potId, page, page_size: 20 });
  return (
    <section aria-label="Recorded donations">
      {isLoading && <p role="status">Loading recorded donations…</p>}
      {error && <p role="status">Recorded donations are unavailable right now.</p>}
      {!isLoading && !error && !data?.length && <p>No recorded donations on this page.</p>}
      {!!data?.length && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <caption>Recorded donations (read-only)</caption>
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Donor</th>
                <th scope="col">Recipient</th>
                <th scope="col">Recorded amount (raw units)</th>
              </tr>
            </thead>
            <tbody>
              {data.map((donation) => (
                <tr key={donation.id}>
                  <td>{displayDate(donation.donated_at)}</td>
                  <td>{donation.donor?.id ?? "Unknown"}</td>
                  <td>{donation.recipient?.id ?? "Matching pool"}</td>
                  <td>{donation.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p>
        Indexer records are historical data, not confirmation that a transfer or refund completed.
      </p>
      <div className={styles.actions}>
        <button
          className={`${styles.button} ${styles.secondary}`}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous donations
        </button>
        <span aria-live="polite">Page {page}</span>
        <button
          className={`${styles.button} ${styles.secondary}`}
          disabled={!data || data.length < 20}
          onClick={() => setPage(page + 1)}
        >
          Next donations
        </button>
      </div>
    </section>
  );
};
