import { useMemo } from "react";

import { Pencil } from "lucide-react";
import { entries, isStrictEqual, omit, pick, piped, prop } from "remeda";

import { walletApi } from "@/common/api/near";
import { ByPotId, potlock } from "@/common/api/potlock";
import {
  Button,
  DataLoadingPlaceholder,
  Skeleton,
} from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccessControlList } from "@/modules/access-control";
import { AccountOption } from "@/modules/core";

import { POT_EDITOR_FIELDS } from "../constants";
import { potIndexedFieldToString } from "../utils/normalization";

type PotEditorPreviewSectionProps = {
  isLoading: boolean;
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
};

const PotEditorPreviewSection: React.FC<PotEditorPreviewSectionProps> = ({
  isLoading,
  heading,
  subheading,
  children,
}) =>
  isLoading ? (
    <Skeleton className="w-102 h-5" />
  ) : (
    <>
      {children ? (
        <div className="md:flex-row md:gap-8 flex flex-col items-center justify-between gap-1">
          <span className="prose md:w-73 font-600 w-full text-sm">
            {subheading ? `${heading} (${subheading})` : heading}
          </span>

          {<span className="prose md:w-102 w-full text-sm">{children}</span>}
        </div>
      ) : null}
    </>
  );

export type PotEditorPreviewProps = Partial<ByPotId> & {
  onEditClick: () => void;
};

export const PotEditorPreview: React.FC<PotEditorPreviewProps> = ({
  potId,
  onEditClick,
}) => {
  const { isLoading, data } = potlock.usePot({ potId });
  const adminAccountIds = data?.admins.map(prop("id"));
  const isDataAvailable = data !== undefined && adminAccountIds !== undefined;

  const isEditingAllowed =
    walletApi.accountId !== undefined &&
    isDataAvailable &&
    [...data.admins, data.owner].some(
      piped(prop("id"), isStrictEqual(walletApi.accountId)),
    );

  const tableContent = useMemo(
    () =>
      isDataAvailable
        ? entries(omit(POT_EDITOR_FIELDS, ["owner", "admins"])).map(
            ([key, { index = "none", ...attrs }]) => (
              <PotEditorPreviewSection
                key={key}
                heading={attrs.title}
                {...{ isLoading }}
              >
                {potIndexedFieldToString(
                  key,
                  data[index as keyof typeof data],
                  attrs,
                )}
              </PotEditorPreviewSection>
            ),
          )
        : null,

    [data, isDataAvailable, isLoading],
  );

  return (
    <div className="max-w-183 flex w-full flex-col gap-8">
      <div className="flex flex-wrap gap-8">
        <div un-pr="4" un-flex="~ col" un-gap="2">
          <span className="prose font-500 text-sm text-neutral-500">
            {"Owner"}
          </span>

          {isDataAvailable ? (
            <AccountOption
              accountId={data?.owner.id ?? "unknown"}
              isRounded
              classNames={{ root: "p-0 pr-2", avatar: "w-6 h-6" }}
            />
          ) : (
            <Skeleton className="w-50 h-8 rounded-full" />
          )}
        </div>

        <div un-w="50" un-flex="~ col" un-gap="2">
          <span className="prose font-500 text-sm text-neutral-500">
            {"Admins"}
          </span>

          {isDataAvailable ? (
            <>
              {adminAccountIds.length > 0 ? (
                <AccessControlList
                  value={adminAccountIds}
                  classNames={{ avatar: "w-6 h-6" }}
                />
              ) : (
                <span className="prose">{"No admins"}</span>
              )}
            </>
          ) : (
            <Skeleton className="w-50 h-8 rounded-full" />
          )}
        </div>

        <div
          className="ml-auto flex flex-col justify-center"
          style={{ display: isEditingAllowed ? undefined : "none" }}
        >
          <Button type="button" onClick={onEditClick} variant="brand-plain">
            <Pencil width={14} height={14} />

            <span className="prose line-height-none font-500">
              {"Edit Pot Settings"}
            </span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "min-h-114 rounded-3 md:p-6 md:gap-4 flex flex-col gap-6 border border-neutral-200 p-4",
        )}
      >
        {!isDataAvailable && isLoading && (
          <DataLoadingPlaceholder text="Loading pot data..." />
        )}

        {tableContent}
      </div>
    </div>
  );
};
