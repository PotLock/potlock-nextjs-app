import fs from "fs";

import { Formidable } from "formidable";
import type { NextApiRequest, NextApiResponse } from "next";

interface IFields {
  name: string[];
}

type ResponseData = {
  IpfsHash: string | null;
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

async function uploadImage(name: string, file: File): Promise<ResponseData> {
  const data = new FormData();
  data.append("file", file);
  data.append("pinataMetadata", JSON.stringify({ name }));

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: data,
  });

  const { IpfsHash } = await res.json();
  return { IpfsHash, error: null };
}

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
    const files = data.files as any;
    const fileName = fields.name[0] as string;
    const file = getDataFile(files.file[0]);
    const res = await uploadImage(fileName, file);
    return response.status(200).send(res);
  } catch (error) {
    console.log(error);
    return response.status(500).send({
      IpfsHash: null,
      error: "Internal Server Error",
    });
  }
}
