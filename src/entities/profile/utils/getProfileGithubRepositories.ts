import { NEARSocialUserProfile } from "@/common/contracts/social";

const getProfileGithubRepositories = (profile?: NEARSocialUserProfile) => {
  const githubRepos = (profile?.plGithubRepos ? JSON.parse(profile.plGithubRepos) : []).map(
    (url: string) => url.replace("github.com/github.com/", "github.com/"),
  );

  return githubRepos as string[];
};

export default getProfileGithubRepositories;
