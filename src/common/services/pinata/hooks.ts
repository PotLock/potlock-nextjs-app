"use client";

import { useCallback, useState } from "react";

import { isNonNullish } from "remeda";

import { useToast } from "@/common/ui/layout/hooks";

import * as client from "./client";

type UseFileUploadParams = {
  onSuccess?: (data: client.FileUploadResult) => void;
};

export const useFileUpload = ({ onSuccess }: UseFileUploadParams | undefined = {}) => {
  const [isPending, setIsPending] = useState(false);
  const [data, setData] = useState<client.FileUploadResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const upload = useCallback(
    (file?: File | null) => {
      if (isNonNullish(file)) {
        setIsPending(true);

        client
          .uploadFile(file)
          .then((result) => {
            onSuccess?.(result);
            setData(result);
          })
          .catch((err) => {
            setError(err);

            toast({
              variant: "destructive",
              title: "Error uploading file",
              description: err.message,
            });
          })
          .finally(() => setIsPending(false));
      } else setError(new Error("No file selected"));
    },

    [onSuccess, toast],
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => upload(e.target.files?.[0]),
    [upload],
  );

  const handleFileBufferChange = useCallback((files?: File[]) => upload(files?.[0]), [upload]);

  return {
    handleFileInputChange,
    handleFileBufferChange,
    isPending,
    data: data ?? undefined,
    error: error ?? undefined,
  };
};
