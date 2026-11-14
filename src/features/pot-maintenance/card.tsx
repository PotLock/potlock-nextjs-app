import * as Dialog from "@radix-ui/react-dialog";

import { NETWORK } from "@/common/_config";
import { POT_MAINTENANCE_MESSAGE } from "@/common/_config/pot-service";
import type { Pot } from "@/common/api/indexer";

import snapshot from "./historical-pots.snapshot.json";
import styles from "./maintenance.module.css";

export type HistoricalPot = Pick<Pot, "account" | "name" | "description"> &
  Partial<Pick<Pot, "matching_round_end">>;

export const HISTORICAL_POTS: HistoricalPot[] = NETWORK === "mainnet" ? snapshot.records : [];
export const POT_SNAPSHOT_DATE = snapshot.capturedAt.slice(0, 10);

export const getPotExplorerUrl = (accountId: string, network = NETWORK) =>
  `https://${network === "testnet" ? "testnet." : ""}nearblocks.io/address/${encodeURIComponent(accountId)}`;

export const PotMaintenanceCard = ({ pot }: { pot: HistoricalPot }) => (
  <Dialog.Root>
    <Dialog.Trigger asChild>
      <button type="button" className={styles.potCard} aria-label={`View ${pot.name} history`}>
        <span className={styles.cardBody}>
          <span className={styles.cardLabel}>Historical Pot · Maintenance</span>
          <span className={styles.cardTitle}>{pot.name}</span>
          <span className={styles.cardDescription}>{pot.description}</span>
        </span>
        <span className={styles.cardFooter}>
          <span className={styles.cardAccount}>{pot.account}</span>
          <span className={styles.cardAction}>
            View history <span aria-hidden="true">↗</span>
          </span>
        </span>
      </button>
    </Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.popupOverlay} />
      <Dialog.Content className={styles.popup}>
        <span className={styles.status}>Indefinite maintenance</span>
        <Dialog.Title className={styles.popupTitle}>Pots are under maintenance</Dialog.Title>
        <Dialog.Description className={styles.popupDescription}>
          {POT_MAINTENANCE_MESSAGE} You can explore this Pot’s historical transactions and contract
          activity on NearBlocks.
        </Dialog.Description>
        <p className={styles.popupPotName}>{pot.name}</p>
        <code className={styles.cardAccount}>{pot.account}</code>
        <div className={styles.actions}>
          <a
            className={styles.button}
            href={getPotExplorerUrl(pot.account)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View contract on NearBlocks <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <Dialog.Close asChild>
            <button type="button" className={`${styles.button} ${styles.secondary}`}>
              Close
            </button>
          </Dialog.Close>
        </div>
        <p className={styles.popupHint}>NearBlocks opens in a new tab.</p>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
