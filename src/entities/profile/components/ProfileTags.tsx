import { useEffect, useState } from "react";

import { styled } from "styled-components";

import { getTagsFromSocialProfileData } from "@/entities/project/utils";

import useProfileData from "../hooks/data";

const TagsContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  max-width: 600px;
`;

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

type Props = {
  accountId: string;
};

export const ProfileTags = ({ accountId }: Props) => {
  const { profile: projectProfile } = useProfileData(accountId);

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
    <TagsContainer>
      {accountId && accountId.endsWith(".sputnik-dao.near") && <Tag>DAO</Tag>}
      {tags.map((tag, tagIndex) => (
        <Tag key={tagIndex}>{tag}</Tag>
      ))}
    </TagsContainer>
  );
};

export default ProfileTags;
