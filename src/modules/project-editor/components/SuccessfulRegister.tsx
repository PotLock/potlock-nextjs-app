import Link from "next/link";

import { Button } from "@/common/ui/components";
import routesPath from "@/modules/core/routes";
import { dispatch } from "@/store";

const SuccessfulRegister = ({
  registeredProject,
  isEdit,
}: {
  registeredProject: string;
  isEdit?: boolean;
}) => {
  const refreshStatus = () => {
    // Reset
    dispatch.projectEditor.submissionStatus("pending");
    dispatch.projectEditor.setBackgroundImage("");
    dispatch.projectEditor.setProfileImage("");
  };

  return (
    <div className="md:p-[72px_64px_72px_64px] flex w-full flex-col p-0">
      {isEdit ? (
        <h1 style={{ textAlign: "center" }}>
          You&apos;ve edited your project successfully!
        </h1>
      ) : (
        <h1 style={{ textAlign: "center" }}>
          You&apos;ve successfully registered!
        </h1>
      )}
      <div className="mt-8 flex items-center justify-center gap-8">
        <Link href={`${routesPath.PROFILE}/${registeredProject}/home`}>
          <Button onClick={refreshStatus}>View your project</Button>
        </Link>
        <Link href={routesPath.PROJECTS_LIST}>
          <Button onClick={refreshStatus} variant="brand-tonal">
            View all projects
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessfulRegister;
