import { styled } from "styled-components";

import type { ByAccountId } from "@/common/types";
import { NearIcon } from "@/common/ui/svg";
import GithubSvg from "@/common/ui/svg/github";
import TwitterSvg from "@/common/ui/svg/twitter";
import WebsiteSvg from "@/common/ui/svg/website";

import { useAccountSocialProfile } from "../hooks/social-profile";

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

export type AccountProfileLinktreeProps = ByAccountId & {};

export const AccountProfileLinktree: React.FC<AccountProfileLinktreeProps> = ({ accountId }) => {
  const { profile } = useAccountSocialProfile({ accountId });

  const itemIconUrls: any = {
    github: <GithubSvg />,
    twitter: <TwitterSvg />,
    website: <WebsiteSvg />,
    NEAR: <NearIcon />,
  };

  const fullUrls: Record<string, any> = {
    twitter: (handle: string) => `https://twitter.com/${handle.trim()}`,
    github: (username: string) => `https://github.com/${username.trim()}`,
    website: (url: string) => (url.includes("http") ? url : `https://${url.trim()}`),
  };

  return profile?.linktree === undefined ? null : (
    // LinktreeContainer
    <div className="flex flex-wrap justify-start gap-4">
      {Object.entries(profile.linktree).map(([k, v]) => {
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
