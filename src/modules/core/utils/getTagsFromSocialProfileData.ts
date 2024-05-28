import { Category, NEARSocialUserProfile } from "@app/contracts/social";

export const getTagsFromSocialProfileData = (
  profileData: NEARSocialUserProfile,
) => {
  // first try to get tags from plCategories, then category (deprecated/old format), then default to empty array

  if (!profileData) return [];

  const tags: string[] = [];

  // Parse plCategories if it exists and is a JSON string
  // Handle deprecated category field
  if (profileData.category) {
    if (typeof profileData.category === "string") {
      tags.push(Category[profileData.category] || profileData.category);
    } else if (
      typeof profileData.category === "object" &&
      "text" in profileData.category
    ) {
      tags.push(profileData.category.text);
    }
  }

  return tags;
};
