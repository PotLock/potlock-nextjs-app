import { IPFS_NEAR_SOCIAL_URL } from "../constants";

export const nearSocialIpfsUpload = async (body: BodyInit) =>
  fetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  });

export const nearSocialIpfsImageUpload = async (files: File[]) =>
  nearSocialIpfsUpload(files[0]).then((response) => {
    if (response.ok) {
      return response
        .json()
        .then((data) => ("cid" in data ? `${IPFS_NEAR_SOCIAL_URL}${data.cid}` : undefined));
    }
  });
