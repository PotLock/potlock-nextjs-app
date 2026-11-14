import Link from "next/link";

import {
  POT_CONTRACT_SOURCES,
  POT_MAINTENANCE_MESSAGE,
  POT_SOURCE_COMMIT,
} from "@/common/_config/pot-service";

import styles from "./maintenance.module.css";

export const PotMaintenanceNotice = () => (
  <section className={styles.notice} aria-labelledby="pot-maintenance-title">
    <span className={styles.status}>Indefinite maintenance</span>
    <h1 id="pot-maintenance-title">Pots are out of service</h1>
    <p>{POT_MAINTENANCE_MESSAGE}</p>
    <div className={styles.actions}>
      <a className={styles.button} href="#contract-code">
        View contract code
      </a>
      <Link className={`${styles.button} ${styles.secondary}`} href="/pots/history">
        View past rounds
      </Link>
    </div>
  </section>
);

export const PotContractSources = () => (
  <section id="contract-code" className={styles.section} aria-labelledby="pot-contract-code-title">
    <h2 id="pot-contract-code-title">Contract codebase</h2>
    <p>Explore the public upstream source for Pot rounds and the PotFactory.</p>
    <ul className={styles.sources}>
      {POT_CONTRACT_SOURCES.map(({ name, href, description }) => (
        <li key={href}>
          <a href={href} target="_blank" rel="noopener noreferrer">
            {name} <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p>{description}</p>
        </li>
      ))}
    </ul>
    <p className={styles.sourceNote}>
      Upstream source at <code>{POT_SOURCE_COMMIT.slice(0, 7)}</code>. These links describe source
      code; they do not verify the code deployed to an individual account.
    </p>
    <a href="https://github.com/PotLock/core" target="_blank" rel="noopener noreferrer">
      Browse repository and fork on GitHub
    </a>
  </section>
);
