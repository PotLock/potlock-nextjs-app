import { useState } from "react";

import { useRegistration } from "@/common/_deprecated/useRegistration";
import { RegistrationStatus } from "@/common/contracts/core";
import { ACCOUNT_REGISTRATION_STATUSES } from "@/entities/_shared/account";

export const ProjectBanner = ({ projectId }: { projectId: string }) => {
  const [toggle, setToggle] = useState(false);

  const { registration, loading } = useRegistration(projectId);

  const registrationStatus = registration
    ? ACCOUNT_REGISTRATION_STATUSES[registration.status]
    : ACCOUNT_REGISTRATION_STATUSES.Unregistered;

  return loading || registration.status === RegistrationStatus.Approved ? null : (
    <div
      className="flex w-full flex-col items-center justify-center p-3 backdrop-blur-[150px]"
      style={{
        background: registrationStatus.background,
      }}
    >
      <div className="flex flex-row items-center justify-center">
        <div
          className="text-center text-xs font-semibold uppercase tracking-[0.015em] md:text-xl"
          onClick={() => (registration.admin_notes ? setToggle(!toggle) : "")}
          style={{
            color: registrationStatus.textColor,
            cursor: registration.admin_notes ? "pointer" : "default",
          }}
        >
          {registrationStatus.text}
          {registration.admin_notes && (
            <div
              className={`ml-2 items-center gap-2 whitespace-nowrap text-xs font-semibold md:text-xl`}
              style={{
                color: registrationStatus.toggleColor,
              }}
            >
              (See {toggle ? "Less" : "Why"})
              <svg
                className={`w-2 transition-all duration-300 ease-in-out md:w-3`}
                style={{
                  rotate: toggle ? "180deg" : "0deg",
                }}
                viewBox="0 0 12 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.59 0.294922L6 4.87492L1.41 0.294922L0 1.70492L6 7.70492L12 1.70492L10.59 0.294922Z"
                  fill="#C7C7C7"
                  style={{
                    fill: registrationStatus.toggleColor,
                    stroke: registrationStatus.toggleColor,
                  }}
                />
              </svg>
            </div>
          )}
        </div>
      </div>
      {registration.admin_notes && (
        <div
          className={`max-h-0 max-w-[1270px] overflow-hidden text-xs uppercase italic transition-all duration-300 ease-in-out`}
          style={{
            color: registrationStatus.toggleColor,
            maxHeight: toggle ? "80px" : "",
            marginTop: toggle ? "12px" : "",
          }}
        >
          Admin notes: {registration.admin_notes}
        </div>
      )}
    </div>
  );
};

export default ProjectBanner;
