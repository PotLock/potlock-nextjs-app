import { type ReactNode, useState } from "react";

import styles from "./maintenance.module.css";

export const HistoricalTable = <T,>({
  rows,
  columns,
  label,
  rowKey,
}: {
  rows: T[];
  columns: { label: string; render: (row: T) => ReactNode }[];
  label: string;
  rowKey: (row: T) => string | number;
}) => {
  const [page, setPage] = useState(0);
  const size = 20;
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const currentPage = Math.min(page, pageCount - 1);
  return (
    <>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <caption>
            {label} · {rows.length.toLocaleString()} records
          </caption>
          <thead>
            <tr>
              {columns.map(({ label: title }) => (
                <th scope="col" key={title}>
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.slice(currentPage * size, (currentPage + 1) * size).map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((column) => (
                  <td key={column.label}>{column.render(row)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p>No {label.toLowerCase()} recorded.</p>}
      </div>
      {pageCount > 1 && (
        <div className={styles.tablePages} aria-label={`${label} pages`}>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous {label.toLowerCase()}
          </button>
          <span aria-live="polite">
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            className={`${styles.button} ${styles.secondary}`}
            disabled={currentPage === pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            Next {label.toLowerCase()}
          </button>
        </div>
      )}
    </>
  );
};
