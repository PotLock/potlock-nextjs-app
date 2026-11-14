import Link from "next/link";

import { type HistoricalPot, formatNear } from "./data";
import styles from "./maintenance.module.css";

export { HISTORICAL_POTS, POT_SNAPSHOT_DATE, getPotExplorerUrl } from "./data";
export type { HistoricalPot } from "./data";

export const PotMaintenanceCard = ({ pot }: { pot: HistoricalPot }) => (
  <Link
    href={`/pot/${encodeURIComponent(pot.account)}`}
    className={styles.potCard}
    aria-label={`View ${pot.name} history`}
  >
    <span className={styles.cardBody}>
      <span className={styles.cardLabel}>Historical Pot · Maintenance</span>
      <span className={styles.cardTitle}>{pot.name}</span>
      <span className={styles.cardDescription}>{pot.description}</span>
    </span>
    <span className={styles.cardFooter}>
      {pot.metrics && (
        <span className={styles.cardMetrics}>
          <span>
            <strong>{formatNear(pot.metrics.publicDonationsNet)} NEAR</strong> public donations
            (net)
          </span>
          <span>
            <strong>{pot.metrics.donationCount.toLocaleString()}</strong> recorded donations
          </span>
        </span>
      )}
      <span className={styles.cardAccount}>{pot.account}</span>
      <span className={styles.cardAction}>
        View historical metrics <span aria-hidden="true">→</span>
      </span>
    </span>
  </Link>
);
