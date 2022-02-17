// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { disconnectStrava } from "../../utils/disconnectStrava";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });

    if (session) {
      const accountId = session.userId as string;

      const response = await disconnectStrava({
        accountId,
      });

      res.json({ status: 200, response });
    } else {
      res.status(401).json({ error: "Not Authorized" });
    }
  } catch (err) {}
}
