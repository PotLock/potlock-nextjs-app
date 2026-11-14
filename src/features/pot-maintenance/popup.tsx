import * as Dialog from "@radix-ui/react-dialog";

import { POT_MAINTENANCE_MESSAGE } from "@/common/_config/pot-service";

import { getPotExplorerUrl } from "./data";
import styles from "./maintenance.module.css";

export const PotHistoricalPopup = ({
  potId,
  name,
  open,
  onOpenChange,
}: {
  potId: string;
  name: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <Dialog.Root open={open} onOpenChange={onOpenChange}>
    <Dialog.Portal>
      <Dialog.Overlay className={styles.popupOverlay} />
      <Dialog.Content
        className={styles.popup}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          document.getElementById("pot-history-title")?.focus();
        }}
      >
        <span className={styles.status}>Historical view · Indefinite maintenance</span>
        <Dialog.Title className={styles.popupTitle}>Explore history, read-only</Dialog.Title>
        <Dialog.Description className={styles.popupDescription}>
          This page shows historical Pot metrics and records. {POT_MAINTENANCE_MESSAGE} Dismiss this
          notice to browse the archive.
        </Dialog.Description>
        <p className={styles.popupPotName}>{name}</p>
        <code className={styles.cardAccount}>{potId}</code>
        <div className={styles.actions}>
          <Dialog.Close asChild>
            <button type="button" className={styles.button}>
              View historical data
            </button>
          </Dialog.Close>
          <a
            className={`${styles.button} ${styles.secondary}`}
            href={getPotExplorerUrl(potId)}
            target="_blank"
            rel="noopener noreferrer"
          >
            View contract on NearBlocks <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);
