import { Pencil } from "lucide-react";
import { entries, omit, prop } from "remeda";

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
        <div un-flex="~" un-justify="between" un-items="center" un-gap="8">
          <span className="prose md:w-73 font-600 w-full text-sm">
            {subheading ? `${heading} (${subheading})` : heading}
          </span>

          {<span className="prose text-sm">{children}</span>}
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

  return (
    <div className="max-w-183 flex w-full flex-col gap-8">
      <div un-flex="~ wrap" un-gap="8">
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
              <span className="prose">{"No admins"}</span>
              <AccessControlList value={adminAccountIds} />
            </>
          ) : (
            <Skeleton className="w-50 h-8 rounded-full" />
          )}
        </div>

        <div className="md:ml-auto flex flex-col justify-center">
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
          "min-h-114 rounded-3 md:p-6 flex flex-col gap-4 border border-neutral-200 p-4",
        )}
      >
        {!isDataAvailable && isLoading && (
          <DataLoadingPlaceholder text="Loading pot data..." />
        )}

        {isDataAvailable &&
          entries(omit(POT_EDITOR_FIELDS, ["owner", "admins"])).map(
            ([key, { index = "none", title }]) => (
              <PotEditorPreviewSection
                key={key}
                heading={title}
                {...{ isLoading }}
              >
                {potIndexedFieldToString(
                  key,
                  data[index as keyof typeof data],
                  title,
                )}
              </PotEditorPreviewSection>
            ),
          )}
      </div>
    </div>
  );
};
