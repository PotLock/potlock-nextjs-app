"use client";

import { useEffect } from "react";

import { RuntimeErrorAlert } from "@/modules/core";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <html>
      <body>
        <RuntimeErrorAlert message={error.message} />
      </body>
    </html>
  );
}
