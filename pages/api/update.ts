// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { updateUser } from "../../utils/updateUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });

    if (session) {
      const accountId = session.userId as string;

      if (req.body) {
        let response, updateField;

        if (req.body.postActivity) {
          response = await updateUser({
            accountId,
            postActivity: req.body?.postActivity,
          });

          updateField = "postActivity";
        } else if (req.body.mapOnly) {
          response = await updateUser({
            accountId,
            mapOnly: req.body?.mapOnly,
          });

          updateField = "mapOnly";
        }

        res.json({ status: 200, response, updateField });
      } else {
        res.status(500).json({ error: "Missing postActiviy Params" });
      }
    } else {
      res.status(401).json({ error: "Not Authorized" });
    }
  } catch (err) {}
}
