import type { NextApiRequest, NextApiResponse } from "next";
import { File, Error, FetchFilesParams } from "../../types/types";
import prisma from "../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ files: File[] } | Error>
) {
  try {
    console.log("getFile");

    if (req.method !== "POST") {
      return res.status(405).send({ message: "Only POST requests allowed" });
    }

    const { parentFolderId, session }: FetchFilesParams = req.body;

    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const files = await prisma.file.findMany({
      where: {
        userId: user.id,
        folderId: parentFolderId,
      },
    });

    res.status(200).json({ files });
  } catch (err) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
