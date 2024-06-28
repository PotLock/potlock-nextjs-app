"use client";

import { RuntimeErrorAlert } from "@/modules/core";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.log(error);

  return (
    <html>
      <body>
        <RuntimeErrorAlert message={error.message} />
      </body>
    </html>
  );
}
