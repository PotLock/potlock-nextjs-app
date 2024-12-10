const convertURLtoGithubURL = (path: string) => {
  // If the path starts with "github.com/", return it as it is
  if (path.startsWith("github.com/")) {
    return `https://${path}`;
  }

  // If the path does not contain "github.com/", assume it's a repository path and prepend the prefix
  return path;
};

export default convertURLtoGithubURL;
