import type { NextApiRequest, NextApiResponse } from "next";
import { Folder, Error, FetchFoldersParams } from "../../types/types";
import prisma from "../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ folders: Folder[] } | Error>
) {
  try {
    console.log(`${req.method} ${req.url}`);

    if (req.method !== "POST") {
      return res.status(405).send({ message: "Only POST requests allowed" });
    }

    const { parentFolderId, session }: FetchFoldersParams = req.body;

    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const folders = await prisma.folder.findMany({
      where: {
        userId: user.id,
        parentFolderId,
      },
    });

    res.status(200).json({ folders });
  } catch (err) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
