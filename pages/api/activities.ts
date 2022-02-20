// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { getGoogleUser } from "../../utils/getGoogleUser";
import { getActivites } from "../../utils/recentActivities";
import { updateUser } from "../../utils/updateUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });

    if (session) {
      const accountId = session.userId as string;

      const googleUser = await getGoogleUser(accountId);

      if (googleUser) {
        const workouts = await getActivites({
          userId: googleUser.userId,
          limit: 15,
        });

        res.json({ status: 200, workouts });
      } else {
        res.status(500).json({ error: `Could not find user ${accountId}` });
      }
    } else {
      res.status(401).json({ error: "Not Authorized" });
    }
  } catch (err) {
    res.status(500).json({ error: `Unknown Error` });
  }
}
