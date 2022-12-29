import type { NextApiRequest, NextApiResponse } from "next";
import { Folder, Error, UpdateFolderParams } from "../../types/types";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ updatedFolder: Folder } | Error>
) {
  try {
    console.log(`${req.method} ${req.url}`);

    if (req.method !== "PUT") {
      return res.status(405).send({ message: "Only PUT requests allowed" });
    }

    const { folderId, newFolderName }: UpdateFolderParams = req.body;
    if (!folderId || !newFolderName)
      return res.status(400).json({ message: "Bad request" });

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const folder = await prisma.folder.findUnique({ where: { id: folderId } });
    if (!folder) return res.status(404).json({ message: "No folder found" });

    if (folder?.userId !== user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const updatedFolder = await prisma.folder.update({
      data: { name: newFolderName },
      where: { id: folderId },
    });

    res.status(200).json({ updatedFolder });
  } catch (err) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
