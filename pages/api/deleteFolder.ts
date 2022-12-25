import type { NextApiRequest, NextApiResponse } from "next";
import { Folder, Error, FolderId } from "../../types/types";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import bucket from "../../lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ deletedFolder: Folder } | Error>
) {
  try {
    console.log("deleteFolder");

    if (req.method !== "DELETE") {
      return res.status(405).send({ message: "Only DELETE requests allowed" });
    }

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const folderId: FolderId = req.body;

    const folder = await prisma.folder.findUnique({ where: { id: folderId } });

    if (!folder) return res.status(404).json({ message: "No folder found" });
    if (folder?.userId !== user.id)
      return res.status(401).json({ message: "Unauthorized" });

    const deletedFolder = await prisma.folder.delete({
      where: { id: folderId },
    });

    const PATH =
      deletedFolder.path.length > 0
        ? `images/${deletedFolder.userId}/${deletedFolder.path.join("/")}/${
            deletedFolder.id
          }/`
        : `images/${deletedFolder.userId}/${deletedFolder.id}/`;

    //console.log(PATH);

    const data = await bucket.deleteFiles({
      prefix: PATH,
    });

    res.status(200).json({ deletedFolder });
  } catch (err) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
