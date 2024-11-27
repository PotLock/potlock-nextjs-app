import { MdAppRegistration, MdCheckCircleOutline } from "react-icons/md";

import { ByPotId } from "@/common/api/indexer";
import { cn } from "@/common/ui/utils";
import { useWallet } from "@/modules/auth";

export type RequirementsContainerProps = {
  title: string;
  children: React.ReactNode;
};

export const RequirementsContainer: React.FC<RequirementsContainerProps> = ({
  title,
  children,
}) => {
  return (
    <div
      className={cn(
        "xl:w-126.5 min-w-87.5 lg:w-fit flex h-[232px] w-full flex-col items-start justify-start",
        "rounded-2xl bg-neutral-50 p-2",
      )}
    >
      <div className={cn("inline-flex items-center", "justify-start gap-2 self-stretch py-2")}>
        <MdAppRegistration className="h-6 w-6" />

        <span
          className={cn(
            "shrink grow basis-0",
            "text-[17px] font-semibold leading-normal text-[#292929]",
          )}
        >
          {title}
        </span>
      </div>

      <div
        className={cn(
          "flex h-44 flex-col items-start justify-start gap-4 self-stretch",
          "rounded-lg bg-white p-4 shadow",
        )}
      >
        {children}
      </div>
    </div>
  );
};

export type RequirementStatusProps = { title: string };

const RequirementStatus: React.FC<RequirementStatusProps> = ({ title }) => {
  return (
    <div className={cn("inline-flex items-center justify-start gap-2 self-stretch")} key={title}>
      <MdCheckCircleOutline className="color-success relative h-6 w-6" />
      <span className="text-sm font-normal leading-tight text-neutral-600">{title}</span>
    </div>
  );
};

export type PotApplicationClearanceStatusProps = ByPotId & {};

export const PotApplicationClearanceStatus: React.FC<PotApplicationClearanceStatusProps> = ({
  potId,
}) => {
  const { wallet } = useWallet();
  const { accountId } = wallet ?? {};

  const METAPOOL_APPLICATION_REQUIREMENTS = [
    { title: "Verified Project on Potlock" },
    { title: "A minimum stake of 500 USD in Meta Pool" },
    { title: "A minimum of 50,000 votes" },
    { title: "A total of 25 points accumulated for the RPGF score" },
  ];

  return (
    <RequirementsContainer title="Application Requirements">
      {METAPOOL_APPLICATION_REQUIREMENTS.map((requirement) => (
        <RequirementStatus key={requirement.title} {...requirement} />
      ))}
    </RequirementsContainer>
  );
};
