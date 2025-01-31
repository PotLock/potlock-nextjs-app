import { useEffect, useState } from "react";

import { styled } from "styled-components";

import type { ByAccountId } from "@/common/types";

import { useAccountSocialProfile } from "../hooks/social-profile";
import { getTagsFromSocialProfileData } from "../utils/getTagsFromSocialProfileData";

const Tag = styled.span`
  color: #292929;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 6px;
  border-radius: 2px;
  background: #ebebeb;
  box-shadow:
    0px -1px 0px 0px #dbdbdb inset,
    0px 0px 0px 0.5px #dbdbdb;
`;

export type AccountProfileTagsProps = ByAccountId & {};

export const AccountProfileTags: React.FC<AccountProfileTagsProps> = ({ accountId }) => {
  const { profile: projectProfile } = useAccountSocialProfile({ accountId });

  const [tags, setTags] = useState<string[]>();

  useEffect(() => {
    if (projectProfile && accountId) {
      projectProfile.tags
        ? setTags(Object.keys(projectProfile.tags || {}))
        : setTags(getTagsFromSocialProfileData(projectProfile));
    }
  }, [accountId, projectProfile]);

  if (!tags || !tags.length) return "No tags";

  return (
    <div className="flex max-w-[600px] flex-wrap gap-3">
      {accountId && accountId.endsWith(".sputnik-dao.near") && <Tag>DAO</Tag>}
      {tags.map((tag, tagIndex) => (
        <Tag key={tagIndex}>{tag}</Tag>
      ))}
    </div>
  );
};
