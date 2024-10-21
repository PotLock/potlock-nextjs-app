import { NEARSocialUserProfile } from "@/common/contracts/social";

import convertURLtoGithubURL from "../utils/convertURLtoGithubURL";
import getProfileGithubRepositories from "../utils/getProfileGithubRepositories";

const Github = ({ profile }: { profile?: NEARSocialUserProfile }) => {
  const githubRepositories = getProfileGithubRepositories(profile);

  if (githubRepositories.length > 0) {
    return (
      <div className="m-0  flex w-full flex-col gap-4">
        {githubRepositories.map((url: string) => (
          <a
            key={url}
            href={convertURLtoGithubURL(url)}
            target="_blank"
            className="transition-duration-300 hover:decoration-none flex items-center gap-4 transition-all hover:translate-x-[4px]"
          >
            <svg
              className="rotate-[45deg]"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.5 0.5V2.5H10.09L0.5 12.09L1.91 13.5L11.5 3.91V12.5H13.5V0.5H1.5Z"
                fill="#7B7B7B"
              />
            </svg>
            <div className="w-fit text-[#292929]">{url}</div>
          </a>
        ))}
      </div>
    );
  }

  return <p className="m-0 flex w-full flex-col">None provided</p>;
};

export default Github;
