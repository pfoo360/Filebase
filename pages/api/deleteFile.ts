import type { NextApiRequest, NextApiResponse } from "next";
import { File, Error } from "../../types/types";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import bucket from "../../lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ deletedFile: File } | Error>
) {
  try {
    console.log(`${req.method} ${req.url}`);

    if (req.method !== "DELETE") {
      return res.status(405).json({ message: "Only DELETE requests allowed" });
    }

    const session = await unstable_getServerSession(req, res, authOptions);

    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const id: string = req.body;

    const file = await prisma.file.findUnique({ where: { id } });
    if (!file) return res.status(404).json({ message: "No file found" });
    if (file?.userId !== user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    const deletedFile = await prisma.file.delete({ where: { id } });

    const FOLDERS = deletedFile.path.join("/");
    const targetFile = bucket.file(
      `images/${user.id}/${FOLDERS}/${deletedFile.fileId}/${deletedFile.name}`
    );
    const data = await targetFile.delete();

    res.status(200).json({ deletedFile });
  } catch (err: any) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
