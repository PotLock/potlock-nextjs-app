import Head from "next/head";

import { POT_MAINTENANCE_MESSAGE } from "@/common/_config/pot-service";

import { PotArchiveList } from "./archive";
import { PotHistoryDashboard } from "./dashboard";
import styles from "./maintenance.module.css";
import { PotContractSources, PotMaintenanceNotice } from "./notice";

export const PotMaintenancePage = ({
  potId,
  history = false,
}: {
  potId?: string;
  history?: boolean;
}) => (
  <main className={styles.page}>
    <Head>
      <title>Pots under maintenance | POTLOCK</title>
    </Head>
    {potId ? (
      <PotHistoryDashboard key={potId} potId={potId} />
    ) : history ? (
      <header className={styles.catalogHeader}>
        <span className={styles.status}>Indefinite maintenance</span>
        <h1>Explore past Pots</h1>
        <p>{POT_MAINTENANCE_MESSAGE}</p>
      </header>
    ) : (
      <PotMaintenanceNotice />
    )}
    {history && <PotArchiveList />}
    <PotContractSources />
  </main>
);
