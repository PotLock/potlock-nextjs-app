import { Dot } from "lucide-react";
import { MdCommentsDisabled } from "react-icons/md";
import { styled } from "styled-components";

import { PotApplication } from "@/common/api/indexer";
import { daysAgo } from "@/common/lib";
import { Button } from "@/common/ui/components";
import { cn } from "@/common/ui/utils";
import { AccountHandle, AccountProfilePicture } from "@/entities/_shared/account";

import { potApplicationFiltersTags } from "./tags";

// TODO: Refactor using TailwindCSS classes
const PotApplicationCardContainer = styled.div`
  .main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    flex: 1;
    .content {
      display: flex;
      flex-direction: column;
      font-size: 17px;
      .message {
        word-wrap: break-word;
        overflow-wrap: break-word;
        word-break: break-word;
        max-width: 100%;
        a {
          word-break: break-word;
          display: inline-block;
          max-width: 100%;
        }
      }
      .notes {
        display: flex;
        flex-direction: column;
        gap: 8px;
        .title {
          color: #7b7b7b;
        }
      }
      button {
        width: fit-content;
      }
    }
  }
`;

export type PotApplicationCardProps = {
  applicationData: PotApplication;
  isChefOrGreater: boolean;
  handleApproveApplication: (projectId: string) => void;
  handleRejectApplication: (projectId: string) => void;
};

export const PotApplicationCard: React.FC<PotApplicationCardProps> = ({
  applicationData,
  isChefOrGreater,
  handleApproveApplication,
  handleRejectApplication,
}) => {
  const { applicant, status, message, submitted_at, reviews } = applicationData;
  const { icon, label } = potApplicationFiltersTags[status];

  return (
    <PotApplicationCardContainer
      className={cn(
        "mx-auto flex min-w-[234px] max-w-[715px] flex-1 flex-col items-start justify-start gap-4",
        "bg-background rounded-2xl border border-[#eaeaea] p-5 md:min-w-[445px]",
      )}
    >
      <div className="inline-flex h-12 w-full items-start justify-start gap-3">
        <AccountProfilePicture className="h-10 w-10" accountId={applicant.id} />

        <div className="flex grow basis-0 items-center justify-start gap-3 self-stretch">
          <div className="inline-flex grow basis-0 flex-col items-start justify-center gap-1">
            <AccountHandle asName accountId={applicant.id} className="text-xl" />

            <div className="inline-flex items-center self-stretch">
              <AccountHandle accountId={applicant.id} />

              <div className="inline-flex flex-nowrap items-center text-sm text-neutral-500">
                <Dot />
                <span className="text-nowrap">{daysAgo(new Date(submitted_at).getTime())}</span>
              </div>
            </div>
          </div>

          <div
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-md border py-1.5 pl-2 pr-3",
              {
                "border-[#f4b37d] bg-[#fdfce9]": status === "Pending",
                "border-[#58f0db] bg-[#effefa]": status === "Approved",
                "border-[#faa7a8] bg-[#fef3f2]": status === "Rejected",
              },
            )}
          >
            {icon}

            <div
              className={cn("text-sm font-medium leading-tight", {
                "text-[#b63d18]": status === "Pending",
                "text-[#0b7a74]": status === "Approved",
                "text-[#b8182d]": status === "Rejected",
              })}
            >
              {label}
            </div>
          </div>
        </div>
      </div>

      <div className="main ml-0 md:ml-12">
        <div className="content text-neutral-600">
          <div className="message">{message}</div>
        </div>
      </div>

      {reviews.map(({ reviewed_at, reviewer: reviewerAccountId, notes }) => (
        <div key={reviewed_at + reviewerAccountId} className="ml-0 self-stretch md:ml-12">
          <div
            className={cn(
              "inline-flex w-full flex-col items-start justify-start gap-3 rounded-xl p-5",
              { "bg-[#fef3f2]": status === "Rejected", "bg-[#f7f7f7]": status !== "Rejected" },
            )}
          >
            <div className="title flex items-center">
              <div className="flex items-center gap-1">
                <AccountProfilePicture
                  accountId={reviewerAccountId}
                  className="h-6 w-6 rounded-full shadow-inner"
                />

                <AccountHandle asName accountId={reviewerAccountId} className="text-[17px]" />
              </div>

              <Dot className="color-neutral-500" />
              <div className="text-[17px] font-semibold text-neutral-500">Admin</div>
            </div>

            {notes ? (
              <div className="text-[17px] font-normal leading-tight text-neutral-700">{notes}</div>
            ) : (
              <div
                className={cn(
                  "mx-auto inline-flex w-full items-center justify-center gap-3 rounded-lg",
                  "bg-background p-2 text-[17px] font-medium text-neutral-500",
                )}
              >
                <MdCommentsDisabled className="color-neutral-500 h-6 w-6" />
                <span className="prose">{"No comment"}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {isChefOrGreater && (
        <div className="flex gap-4 self-end">
          {status !== "Approved" && (
            <Button
              variant={"standard-outline"}
              onClick={() => handleApproveApplication(applicant.id)}
            >
              Accept
            </Button>
          )}

          {status !== "Rejected" && (
            <Button
              variant={"standard-outline"}
              onClick={() => handleRejectApplication(applicant.id)}
            >
              Reject
            </Button>
          )}
        </div>
      )}
    </PotApplicationCardContainer>
  );
};
