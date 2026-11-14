import Head from "next/head";

import { PotArchiveDetails, PotArchiveList } from "./archive";
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
    <PotMaintenanceNotice />
    {history && <PotArchiveList />}
    {potId && <PotArchiveDetails key={potId} potId={potId} />}
    <PotContractSources />
  </main>
);
