import GithubSvg from "@/assets/svgs/github";
import NearSvg from "@/assets/svgs/near";
import TwitterSvg from "@/assets/svgs/twitter";
import WebsiteSvg from "@/assets/svgs/website";

import { LinktreeContainer, LinktreeItemContainer } from "./styled";
import useProfileData from "../../hooks/useProfileData";

type Props = {
  accountId: string;
};

const Linktree = ({ accountId }: Props) => {
  const profile = useProfileData(accountId);

  const linktree = profile?.linktree;

  if (!linktree) return "";

  const itemIconUrls: any = {
    github: <GithubSvg />,
    twitter: <TwitterSvg />,
    website: <WebsiteSvg />,
    NEAR: <NearSvg />,
  };

  const fullUrls: Record<string, any> = {
    twitter: (handle: string) => `https://twitter.com/${handle.trim()}`,
    github: (username: string) => `https://github.com/${username.trim()}`,
    website: (url: string) =>
      url.includes("http") ? url : `https://${url.trim()}`,
  };

  return (
    <LinktreeContainer>
      {Object.entries(linktree).map(([k, v]) => {
        return k in itemIconUrls && v ? (
          <LinktreeItemContainer
            key={k}
            href={fullUrls[k](v)}
            onClick={(e) => {
              if (!v) {
                e.preventDefault();
              }
            }}
            target="_blank"
          >
            {itemIconUrls[k]}
          </LinktreeItemContainer>
        ) : null;
      })}
      <LinktreeItemContainer
        target="_blank"
        href={`https://near.social/mob.near/widget/ProfilePage?accountId=${accountId}`}
      >
        {itemIconUrls.NEAR}
      </LinktreeItemContainer>
    </LinktreeContainer>
  );
};

export default Linktree;
