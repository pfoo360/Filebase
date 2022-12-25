import type { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import { Folder, Error, AddFolderParams } from "../../types/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ folder: Folder } | Error>
) {
  try {
    console.log("addFolder");

    if (req.method !== "POST") {
      return res.status(405).send({ message: "Only POST requests allowed" });
    }

    const { folderName, parentFolderId, path }: AddFolderParams = req.body;
    if (
      folderName === null ||
      folderName === undefined ||
      folderName === "" ||
      !folderName
    )
      return res.status(400).json({ message: "Missing folder name" });

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!parentFolderId) {
      const folder = await prisma.folder.create({
        data: {
          name: folderName,
          userId: user.id,
        },
      });

      return res.status(200).json({ folder });
    }

    const folder = await prisma.folder.create({
      data: {
        name: folderName,
        userId: user.id,
        parentFolderId,
        path,
      },
    });

    res.status(200).json({ folder });
  } catch (err) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
