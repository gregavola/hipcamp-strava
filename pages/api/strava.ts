// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import strava from "strava-v3";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  strava.config({
    access_token: process.env.STRAVA_ACCESS_TOKEN || "",
    client_id: process.env.STRAVA_CLIENT_ID || "",
    client_secret: process.env.STRAVA_CLIENT_SECRET || "",
    redirect_uri: process.env.STRAVA_REDIRECT_URI || "",
  });

  const scope = "activity:read";

  const oauthLoginUrl = await strava.oauth.getRequestAccessURL({
    scope,
    approval_prompt: "force",
  });

  res.writeHead(301, { Location: oauthLoginUrl }).end();
}
