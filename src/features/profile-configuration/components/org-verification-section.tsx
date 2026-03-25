import { useCallback, useState } from "react";

import { useOrgVerification } from "@/common/api/indexer/hooks";
import { taxVerificationApi } from "@/common/api/indexer/tax-verification";
import { TextField } from "@/common/ui/form/components";
import { Button, FormLabel } from "@/common/ui/layout/components";
import { cn } from "@/common/ui/layout/utils";

import { Row } from "./editor-elements";

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  Pending: { bg: "bg-[#FFF0E1]", text: "text-[#EA6A25]", label: "Verifying..." },
  Approved: { bg: "bg-[#E1F5ED]", text: "text-[#0B7A74]", label: "Verified 501(c)(3)" },
  Rejected: { bg: "bg-[#FFE1E1]", text: "text-[#ED464F]", label: "Not Verified" },
};

const FieldDisplay = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex w-full flex-col gap-[0.45em] text-[14px]">
    <FormLabel className="m-0">{label}</FormLabel>
    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-600">
      {value || "—"}
    </div>
  </div>
);

type OrgVerificationSectionProps = {
  accountId?: string;
};

export const OrgVerificationSection: React.FC<OrgVerificationSectionProps> = ({ accountId }) => {
  const { data: verification, mutate } = useOrgVerification({
    accountId: accountId ?? "",
    enabled: !!accountId,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [ein, setEin] = useState("");

  const handleSubmit = useCallback(async () => {
    if (!accountId) return;

    const trimmedEin = ein.trim();

    // EIN format validation
    if (!/^\d{2}-?\d{7}$/.test(trimmedEin)) {
      setSubmitError("EIN must be in XX-XXXXXXX format (9 digits)");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const result = await taxVerificationApi.submitOrgVerification({
      account_id: accountId,
      ein: trimmedEin,
    });

    setIsSubmitting(false);

    if (result.success) {
      mutate();
    } else {
      setSubmitError(result.message ?? "Verification failed");
    }
  }, [accountId, ein, mutate]);

  if (!accountId) return null;

  const statusStyle = verification ? STATUS_STYLES[verification.status] : null;

  // Verified view — show IRS data
  if (verification?.status === "Approved") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        {statusStyle && (
          <div
            className={cn(
              "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
              statusStyle.bg,
              statusStyle.text,
            )}
          >
            {statusStyle.label}
          </div>
        )}

        <Row>
          <FieldDisplay label="EIN" value={verification.ein} />
          <FieldDisplay label="Organization Name (IRS)" value={verification.legal_name} />
        </Row>

        <Row>
          <FieldDisplay label="Address" value={verification.address} />
          <FieldDisplay
            label="City / State / Zip"
            value={
              [verification.city, verification.state, verification.zip_code]
                .filter(Boolean)
                .join(", ") || null
            }
          />
        </Row>

        <Row>
          <FieldDisplay label="NTEE Code" value={verification.ntee_code} />
          <FieldDisplay label="IRS Ruling Date" value={verification.ruling_date} />
        </Row>
      </div>
    );
  }

  // Rejected view — show reason and allow retry
  if (verification?.status === "Rejected") {
    return (
      <div className="mt-6 flex flex-col gap-4">
        <div
          className={cn(
            "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider",
            STATUS_STYLES.Rejected.bg,
            STATUS_STYLES.Rejected.text,
          )}
        >
          {STATUS_STYLES.Rejected.label}
        </div>

        {verification.rejection_reason && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {verification.rejection_reason}
          </div>
        )}

        <p className="text-sm text-neutral-600">
          The EIN <strong>{verification.ein}</strong> could not be verified as a 501(c)(3). You can
          try again with a different EIN.
        </p>

        <Row>
          <TextField
            label="EIN (Employer Identification Number)"
            required
            type="text"
            value={ein}
            onChange={(e) => {
              setEin(e.target.value);
              setSubmitError(null);
            }}
            placeholder="XX-XXXXXXX"
            maxLength={10}
            classNames={{ root: "w-full" }}
          />
        </Row>

        {submitError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        <div className="mt-2">
          <Button
            variant="standard-filled"
            onClick={handleSubmit}
            disabled={isSubmitting}
            type="button"
          >
            {isSubmitting ? "Verifying..." : "Try Again"}
          </Button>
        </div>
      </div>
    );
  }

  // Default — no verification yet, show EIN input
  return (
    <div className="mt-6 flex flex-col gap-4">
      <Row>
        <TextField
          label="EIN (Employer Identification Number)"
          required
          type="text"
          value={ein}
          onChange={(e) => {
            setEin(e.target.value);
            setSubmitError(null);
          }}
          placeholder="XX-XXXXXXX"
          maxLength={10}
          classNames={{ root: "w-full" }}
        />
      </Row>

      {submitError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="mt-2">
        <Button
          variant="standard-filled"
          onClick={handleSubmit}
          disabled={isSubmitting}
          type="button"
        >
          {isSubmitting ? "Verifying..." : "Verify 501(c)(3) Status"}
        </Button>
      </div>
    </div>
  );
};
