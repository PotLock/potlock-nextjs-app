"use client";

const uploadFileToIPFS = (
  body: BodyInit,
  callback: (value: Response) => void,
) => {
  fetch("https://ipfs.near.social/add", {
    method: "POST",
    headers: { Accept: "application/json" },
    body,
  }).then(callback);
};

export default uploadFileToIPFS;
