import type { NextApiRequest, NextApiResponse } from "next";
import { File, Error, FileInformation } from "../../types/types";
import prisma from "../../lib/prismadb";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ file: File } | Error>
) {
  try {
    console.log(`${req.method} ${req.url}`);

    if (req.method !== "POST") {
      return res.status(405).json({ message: "Only POST requests allowed" });
    }

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const {
      fileId,
      name,
      type,
      size,
      downloadUrl,
      parentFolderId: folderId,
      userId,
      path,
    }: FileInformation = req.body;

    const parentFolder = await prisma.folder.findUnique({
      where: { id: folderId },
    });
    if (!parentFolder)
      return res.status(404).json({ message: "Folder not found" });
    if (user?.id !== userId || parentFolder.userId !== userId)
      return res.status(401).json({ message: "Unauthorized" });

    const file = await prisma.file.create({
      data: {
        fileId,
        name,
        type,
        size,
        path,
        downloadUrl,
        folderId,
        userId,
      },
    });
    res.status(200).json({ file });
  } catch (err: any) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
