"use client";

import { useCallback, useState } from "react";

import type { PinResponse } from "pinata-web3";

import * as client from "./client";

// TODO: QA, built-in `const ipfsUrl = await pinata.gateways.convert(upload.IpfsHash)`
export const useFileUpload = () => {
  const [file, setFile] = useState<File>();
  const [isPending, setIsPending] = useState(false);
  const [response, setResponse] = useState<PinResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const upload = useCallback(() => {
    if (file) {
      setIsPending(true);

      client
        .upload({ file })
        .then(setResponse)
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
    data: response ?? undefined,
    error: error ?? undefined,
  };
};
