import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import strava from "strava-v3";
import { addUser } from "../../utils/crudUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (session) {
    const accountId = session.userId as string;

    const codeQuery = req.query?.code;

    if (codeQuery) {
      try {
        const results = await strava.oauth.getToken(codeQuery as string, () => {
          console.log("complete");
        });

        const userResponse = await addUser({
          accountId,
          name: `${results.athlete.firstname} ${results.athlete.lastname}`.trim(),
          userId: results.athlete.id,
          userName: results.athlete.username,
          avatar: results.athlete.profile,
          accessToken: results.access_token,
          refreshToken: results.refresh_token,
          expiresAt: results.expires_at,
        });

        res.writeHead(301, { Location: "/strava?success=true" }).end();
      } catch (err) {
        console.log(err);

        res.writeHead(301, { Location: "/?error=true" }).end();
      }
    } else {
      res.status(500).json({ error: "Missing Code from Strava" });
    }
  } else {
    res.status(500).json({ error: "Invalid Authentication" });
  }
}
