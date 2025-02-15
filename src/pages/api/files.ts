import fs from "fs";

import { Formidable } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

import { pinata } from "@/common/services/pinata";

interface IFields {
  name: string[];
}

type ResponseData = {
  ipfsHash: string | null;
  url: string | null;
  error: string | null;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const getDataFile = (files: any) => {
  const buffer = fs.readFileSync(files.filepath);
  const arraybuffer = Uint8Array.from(buffer);

  const file = new File([arraybuffer], files.originalFilename, {
    type: files.mimetype,
  });

  return file;
};

// async function uploadFile(name: string, file: File): Promise<ResponseData> {
//   const data = new FormData();
//   data.append("file", file);
//   data.append("pinataMetadata", JSON.stringify({ name }));

//   const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.PINATA_JWT}`,
//     },
//     body: data,
//   });

//   const { IpfsHash } = await res.json();
//   return { IpfsHash, error: null };
// }

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResponseData>,
) {
  try {
    const data: { fields: unknown; files: unknown } = await new Promise((resolve, reject) => {
      const form = new Formidable();

      form.parse(request, (err, fields, files) => {
        if (err) reject({ err });
        resolve({ fields, files });
      });
    });

    const fields = data.fields as IFields;
    const files = data.files as { file: File[] };
    const fileName = fields.name[0] as string;
    const file = getDataFile(files.file[0]);

    const uploadData = await pinata.upload.file(file);
    const url = await pinata.gateways.convert(uploadData.IpfsHash);

    return response.status(200).send({
      ipfsHash: uploadData.IpfsHash,
      url,
      error: null,
    });
  } catch (error) {
    console.log(error);

    return response.status(500).send({
      ipfsHash: null,
      url: null,
      error: "Internal Server Error",
    });
  }
}
