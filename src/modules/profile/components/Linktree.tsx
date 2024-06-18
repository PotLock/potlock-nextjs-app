import { styled } from "styled-components";

import GithubSvg from "@/common/assets/svgs/github";
import NearSvg from "@/common/assets/svgs/near";
import TwitterSvg from "@/common/assets/svgs/twitter";
import WebsiteSvg from "@/common/assets/svgs/website";

import useProfileData from "../hooks/useProfileData";

const LinktreeItemContainer = styled.a`
  display: flex;
  svg {
    width: 24px;
    height: 24px;
    path,
    rect {
      transition: all 300ms ease-in-out;
    }
    &#near-logo:hover path {
      fill: white;
    }
    :hover path,
    :hover rect {
      fill: #292929;
    }
  }
`;

type Props = {
  accountId: string;
};

const Linktree = ({ accountId }: Props) => {
  const { profile } = useProfileData(accountId);

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
    // LinktreeContainer
    <div className="flex flex-wrap justify-start gap-4">
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
    </div>
  );
};

export default Linktree;
