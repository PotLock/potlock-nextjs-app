import { useMemo } from "react";

import { Pencil } from "lucide-react";
import { entries, isStrictEqual, omit, piped, prop } from "remeda";

import { ByPotId, indexer } from "@/common/api/indexer";
import { walletApi } from "@/common/api/near/client";
import { isAccountId } from "@/common/lib";
import { Button, DataLoadingPlaceholder, Skeleton } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountGroup, AccountListItem, AccountProfileLink } from "@/entities/account";

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
        <div className="flex flex-col items-center justify-between gap-1 md:flex-row md:gap-8">
          <span className="prose md:w-73 font-600 w-full text-sm">
            {subheading ? `${heading} (${subheading})` : heading}
          </span>

          {typeof children === "string" && isAccountId(children) ? (
            <AccountProfileLink
              accountId={children}
              classNames={{ root: "md:w-102 w-full", name: "text-sm" }}
            />
          ) : (
            <span className="prose md:w-102 w-full text-sm">{children}</span>
          )}
        </div>
      ) : null}
    </>
  );

export type PotEditorPreviewProps = Partial<ByPotId> & {
  onEditClick: () => void;
  className?: string;
};

export const PotEditorPreview: React.FC<PotEditorPreviewProps> = ({
  potId,
  onEditClick,
  className,
}) => {
  const { isLoading, data: pot } = indexer.usePot({ potId });
  const adminAccountIds = pot?.admins.map(prop("id"));
  const isDataAvailable = pot !== undefined && adminAccountIds !== undefined;

  const isEditingAllowed =
    walletApi.accountId !== undefined &&
    isDataAvailable &&
    [...pot.admins, pot.owner].some(piped(prop("id"), isStrictEqual(walletApi.accountId)));

  const tableContent = useMemo(
    () =>
      isDataAvailable
        ? entries(omit(POT_EDITOR_FIELDS, ["owner", "admins"])).map(
            ([key, { index = "none", ...attrs }]) => (
              <PotEditorPreviewSection key={key} heading={attrs.title} {...{ isLoading }}>
                {potIndexedFieldToString(key, pot[index as keyof typeof pot], attrs)}
              </PotEditorPreviewSection>
            ),
          )
        : null,

    [pot, isDataAvailable, isLoading],
  );

  return (
    <div className="max-w-206 flex w-full flex-col gap-8">
      <div className="flex flex-wrap gap-8">
        <div un-pr="4" un-flex="~ col" un-gap="2">
          <span className="prose font-500 text-sm text-neutral-500">{"Owner"}</span>

          {isDataAvailable ? (
            <AccountListItem
              accountId={pot.owner.id}
              isRounded
              classNames={{ root: "p-0 pr-2", avatar: "w-6 h-6" }}
            />
          ) : (
            <Skeleton className="w-50 h-8 rounded-full" />
          )}
        </div>

        <div un-w="50" un-flex="~ col" un-gap="2">
          <span className="prose font-500 text-sm text-neutral-500">{"Admins"}</span>

          {isDataAvailable ? (
            <>
              {adminAccountIds.length > 0 ? (
                <AccountGroup
                  value={adminAccountIds?.map((admin) => ({ accountId: admin }))}
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

            <span className="prose line-height-none font-500">{"Edit Pot Settings"}</span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          "min-h-114 rounded-2 flex flex-col gap-6",
          "bg-neutral-50 p-4 md:gap-4 md:p-6",
        )}
      >
        {!isDataAvailable && isLoading && <DataLoadingPlaceholder text="Loading pot data..." />}

        {tableContent}
      </div>
    </div>
  );
};
