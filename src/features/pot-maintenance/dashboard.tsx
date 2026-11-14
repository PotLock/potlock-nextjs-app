import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";

import { POT_MAINTENANCE_MESSAGE } from "@/common/_config/pot-service";

import {
  type CapturedPotHistory,
  HISTORICAL_POTS,
  type HistoricalMetrics,
  POT_SNAPSHOT_DATE,
  formatHistoryDate,
  formatNear,
  getPotExplorerUrl,
  loadCapturedPotHistory,
  summarizeHistoricalPots,
} from "./data";
import styles from "./maintenance.module.css";
import { PotHistoricalPopup } from "./popup";
import { HistoricalTable } from "./table";

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className={styles.metric}>
    <dt>{label}</dt>
    <dd>{typeof value === "number" ? value.toLocaleString() : value}</dd>
  </div>
);

export const PotHistoryTotals = () => {
  if (!HISTORICAL_POTS.length) return null;
  const totals = summarizeHistoricalPots(HISTORICAL_POTS);
  return (
    <section className={styles.archive} aria-label="Archive totals">
      <h2>Across the historical archive</h2>
      <p>Contract records captured {POT_SNAPSHOT_DATE}. Amounts are in NEAR.</p>
      <dl className={styles.metrics}>
        <Metric label="Archived Pots" value={totals.pots} />
        <Metric label="Recorded donations" value={totals.donations} />
        <Metric label="Public donations (net)" value={formatNear(totals.publicDonationsNet)} />
        <Metric label="Payouts recorded as paid" value={formatNear(totals.payoutsPaid)} />
      </dl>
    </section>
  );
};

const RoundMetrics = ({ metrics }: { metrics: HistoricalMetrics }) => (
  <dl className={styles.metrics}>
    <Metric label="Public donations (net NEAR)" value={formatNear(metrics.publicDonationsNet)} />
    <Metric label="Recorded matching pool (NEAR)" value={formatNear(metrics.matchingPoolBalance)} />
    <Metric label="All donations (gross NEAR)" value={formatNear(metrics.donationsGross)} />
    <Metric label="Unique donor accounts" value={metrics.uniqueDonors} />
    <Metric
      label="Public / matching donations"
      value={`${metrics.publicDonationCount.toLocaleString()} / ${metrics.matchingDonationCount.toLocaleString()}`}
    />
    <Metric
      label="Approved / total applications"
      value={`${metrics.approvedProjects} / ${metrics.applicants}`}
    />
    <Metric label="Allocated payouts (NEAR)" value={formatNear(metrics.payoutsAllocated)} />
    <Metric label="Payouts recorded as paid (NEAR)" value={formatNear(metrics.payoutsPaid)} />
  </dl>
);

export const PotHistoryDashboard = ({ potId }: { potId: string }) => {
  const record = HISTORICAL_POTS.find(({ account }) => account === potId);
  const [noticeOpen, setNoticeOpen] = useState(true);

  const {
    data: history,
    error,
    isLoading,
    mutate,
  } = useSWR(
    record?.blockHeight
      ? ([`/pot-history/${encodeURIComponent(potId)}.json`, potId, record.blockHeight] as const)
      : null,
    ([url, account, block]) => loadCapturedPotHistory(url, account, block),
    { refreshInterval: 0, revalidateOnFocus: false, errorRetryCount: 1 },
  );

  const metrics = history?.metrics ?? record?.metrics;
  const name = record?.name ?? potId;
  return (
    <>
      <Head>
        <title>{name} · Historical Pot | POTLOCK</title>
      </Head>
      <header className={styles.catalogHeader}>
        <Link href="/pots">← All historical Pots</Link>
        <span className={styles.historyBadge}>Historical archive · Under maintenance</span>
        <h1 id="pot-history-title" tabIndex={-1}>
          {name}
        </h1>
        <p>
          {record?.description ??
            "This round record is unavailable in the captured archive. You can still inspect its contract history on NearBlocks."}
        </p>
        <code className={styles.cardAccount}>{potId}</code>
      </header>
      <aside className={styles.historyNotice} aria-label="Historical view notice">
        <p>{POT_MAINTENANCE_MESSAGE}</p>
        <button
          type="button"
          className={`${styles.button} ${styles.secondary}`}
          onClick={() => setNoticeOpen(true)}
        >
          About this historical view
        </button>
      </aside>
      {record && (
        <p className={styles.provenance}>
          Snapshot: {POT_SNAPSHOT_DATE} · Finalized block {record.blockHeight?.toLocaleString()}.
          These are historical contract records, not current spendable balances or independent
          transfer confirmations.
        </p>
      )}
      <div className={styles.actions}>
        <a
          className={styles.button}
          href={getPotExplorerUrl(potId)}
          target="_blank"
          rel="noopener noreferrer"
        >
          View contract on NearBlocks <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
      {metrics && (
        <section id="overview" className={styles.archive}>
          <h2>Round overview</h2>
          <RoundMetrics metrics={metrics} />
        </section>
      )}
      {record && (
        <nav className={styles.historyNav} aria-label="Historical round sections">
          {[
            ["projects", "Projects & applications"],
            ["donations", "Donations"],
            ["sponsors", "Sponsors"],
            ["payouts", "Payouts"],
            ["timeline", "Timeline & contract"],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      )}
      {isLoading && <p role="status">Loading detailed historical records…</p>}
      {error && (
        <div role="status">
          <p>Detailed records are unavailable. Saved summary metrics remain visible.</p>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            onClick={() => void mutate()}
          >
            Retry historical records
          </button>
        </div>
      )}
      {history && <HistoricalRoundRecords history={history} />}
      <PotHistoricalPopup
        potId={potId}
        name={name}
        open={noticeOpen}
        onOpenChange={setNoticeOpen}
      />
    </>
  );
};

const HistoricalRoundRecords = ({ history }: { history: CapturedPotHistory }) => {
  const monthlyColumns = [
    {
      label: "Month (UTC)",
      render: (row: CapturedPotHistory["donationMonths"][number]) => row.month,
    },
    {
      label: "Donations",
      render: (row: CapturedPotHistory["donationMonths"][number]) => row.count.toLocaleString(),
    },
    {
      label: "Donor accounts",
      render: (row: CapturedPotHistory["donationMonths"][number]) =>
        row.uniqueDonors.toLocaleString(),
    },
    {
      label: "Gross NEAR",
      render: (row: CapturedPotHistory["donationMonths"][number]) => formatNear(row.gross),
    },
    {
      label: "Net NEAR",
      render: (row: CapturedPotHistory["donationMonths"][number]) => formatNear(row.net),
    },
  ];

  const config = history.config;
  return (
    <>
      <section id="projects" className={styles.archive}>
        <h2>Projects & applications</h2>
        <p>
          {history.metrics.approvedProjects} approved projects from {history.metrics.applicants}{" "}
          recorded applications.
        </p>
        <HistoricalTable
          rows={history.applicationStatuses}
          label="Application statuses"
          rowKey={(a) => a.status}
          columns={[
            { label: "Recorded status", render: (a) => a.status },
            { label: "Applications", render: (a) => a.count.toLocaleString() },
          ]}
        />
        <HistoricalTable
          rows={history.applicationMonths}
          label="Application months"
          rowKey={(a) => `${a.month}:${a.status}`}
          columns={[
            { label: "Submitted month (UTC)", render: (a) => a.month },
            { label: "Recorded status", render: (a) => a.status },
            { label: "Applications", render: (a) => a.count.toLocaleString() },
          ]}
        />
      </section>
      <section id="donations" className={styles.archive}>
        <h2>Public donation history</h2>
        <p>
          Monthly totals across all {history.metrics.publicDonationCount.toLocaleString()} recorded
          public donations. Account counts can overlap between months.
        </p>
        <HistoricalTable
          rows={history.donationMonths}
          columns={monthlyColumns}
          label="Donation months"
          rowKey={(d) => d.month}
        />
      </section>
      <section id="sponsors" className={styles.archive}>
        <h2>Matching pool sponsors</h2>
        <p>
          {history.metrics.uniqueSponsors} sponsor accounts ·{" "}
          {history.metrics.matchingDonationCount} recorded contributions. Monthly account counts can
          overlap.
        </p>
        <HistoricalTable
          rows={history.sponsorshipMonths}
          columns={monthlyColumns}
          label="Sponsorship months"
          rowKey={(d) => d.month}
        />
      </section>
      <section id="payouts" className={styles.archive}>
        <h2>Matching payouts</h2>
        <p>
          {history.metrics.paidPayoutCount} of {history.metrics.payoutCount} payouts recorded as
          paid. Round status: {config.all_paid_out ? "marked paid out" : "not marked paid out"}.
        </p>
        <HistoricalTable
          rows={history.payoutMonths}
          label="Payout months"
          rowKey={(p) => p.month}
          columns={[
            { label: "Recorded payment month (UTC)", render: (p) => p.month },
            { label: "Payouts", render: (p) => p.count.toLocaleString() },
            { label: "Allocated amount (NEAR)", render: (p) => formatNear(p.amount) },
          ]}
        />
      </section>
      <section id="timeline" className={styles.archive}>
        <h2>Round timeline & contract</h2>
        <dl className={styles.details}>
          {[
            ["Applications opened", formatHistoryDate(config.application_start_ms)],
            ["Applications closed", formatHistoryDate(config.application_end_ms)],
            ["Matching round opened", formatHistoryDate(config.public_round_start_ms)],
            ["Matching round ended", formatHistoryDate(config.public_round_end_ms)],
            ["Cooldown ended", formatHistoryDate(config.cooldown_end_ms)],
            ["Chef assigned", config.chef_assigned ? "Yes" : "No"],
            ["Admin accounts", config.admin_count.toString()],
            ["Maximum approved projects", config.max_projects.toString()],
            ["Chef fee", `${config.chef_fee_basis_points / 100}%`],
            [
              "Matching / public referral fee",
              `${config.referral_fee_matching_pool_basis_points / 100}% / ${config.referral_fee_public_round_basis_points / 100}%`,
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <p>
          Metrics are aggregated. Individual account and transaction records can be explored on
          NearBlocks.
        </p>
        <a
          href={`/pot-history/${encodeURIComponent(history.account)}.json`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View captured aggregate metrics (JSON)
        </a>
      </section>
    </>
  );
};
