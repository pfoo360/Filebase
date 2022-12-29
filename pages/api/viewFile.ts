import type { NextApiRequest, NextApiResponse } from "next";
import { Error } from "../../types/types";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../lib/prismadb";
import bucket from "../../lib/firebaseAdmin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ signedUrl: string } | Error>
) {
  try {
    console.log(`${req.method} ${req.url}`);

    if (req.method !== "POST") {
      return res.status(405).send({ message: "Only POST requests allowed" });
    }

    const { id }: { id: string } = req.body;
    if (id === "" || id === null || id === undefined || !id)
      return res.status(400).json({ message: "Bad request" });

    const session = await unstable_getServerSession(req, res, authOptions);
    if (!session || !session?.user?.email)
      return res.status(401).json({ message: "Unauthorized" });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const file = await prisma.file.findUnique({ where: { id } });

    if (!file) return res.status(404).json({ message: "No file found" });
    if (file?.userId !== user?.id)
      return res.status(401).json({ message: "Unauthorized" });

    const CONFIG: {
      action: "read" | "write" | "delete" | "resumable";
      expires: number;
    } = {
      action: "read",
      expires: Date.now() + 1000 * 60 * 5,
    };

    const PATH = `images/${user.id}/${file.path.join("/")}/${file.fileId}/${
      file.name
    }`;

    const signedUrl = await bucket.file(PATH).getSignedUrl(CONFIG);

    res.status(200).json({ signedUrl: signedUrl[0] });
  } catch (err) {
    console.log(err?.stack);

    const name = err?.name ? err.name : "Server error";
    const status = err?.status ? err.status : 500;
    const message = err?.message ? err.message : "Something went wrong";

    res.status(status).json({ name, message });
  }
}
