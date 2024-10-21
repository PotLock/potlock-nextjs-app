import { CreateProjectState } from "../models";

const getSocialDataFormat = (data: CreateProjectState) => {
  const body = {
    // Basic Profile details
    profile: {
      // Background Image
      ...(data.backgroundImage
        ? { backgroundImage: data.backgroundImage }
        : { backgroundImage: null }),
      // Profile Image
      ...(data.profileImage ? { image: data.profileImage } : { image: null }),
      // Data
      name: data.name,
      plCategories: JSON.stringify(data.categories),
      description: data.description,
      plPublicGoodReason: data.publicGoodReason,
      plSmartContracts: data.smartContracts
        ? JSON.stringify(data.smartContracts)
        : null,
      plGithubRepos: JSON.stringify(data.githubRepositories),
      plFundingSources: JSON.stringify(data.fundingSources),
      linktree: {
        website: data.website,
        twitter: data.twitter,
        telegram: data.telegram,
        github: data.github,
      },
      plTeam: JSON.stringify(data.teamMembers),
    },
    // Auto Follow and Star Potlock
    index: {
      star: {
        key: {
          type: "social",
          path: `potlock.near/widget/Index`,
        },
        value: {
          type: "star",
        },
      },
      notify: {
        key: "potlock.near",
        value: {
          type: "star",
          item: {
            type: "social",
            path: `potlock.near/widget/Index`,
          },
        },
      },
    },
    graph: {
      star: {
        ["potlock.near"]: {
          widget: {
            Index: "",
          },
        },
      },
      follow: {
        ["potlock.near"]: "",
      },
    },
  };

  return body;
};

export default getSocialDataFormat;
