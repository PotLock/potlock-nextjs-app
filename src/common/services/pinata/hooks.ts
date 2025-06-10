"use client";

import { useCallback, useState } from "react";

import * as client from "./client";

export const useFileUpload = () => {
  const [file, setFile] = useState<File>();
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<client.FileUploadResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(() => {
    if (file) {
      setIsPending(true);

      client
        .uploadFile(file)
        .then(setData)
        .catch(setError)
        .finally(() => setIsPending(false));
    } else setError(new Error("No file selected"));
  }, [file]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target?.files?.[0]);
  }, []);

  return {
    isPending,
    handleFileInputChange,
    upload,
    data: data ?? undefined,
    error: error ?? undefined,
  };
};
