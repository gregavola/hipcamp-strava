// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { ppid } from "process";
import { getGoogleUser } from "../../utils/getGoogleUser";
import { getLeaderboard } from "../../utils/getLeaderboard";
import { prettyTime } from "../../utils/prettyTime";
import { getActivites } from "../../utils/recentActivities";
import { LeaderboardUsers } from "../../utils/types";
import { updateUser } from "../../utils/updateUser";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let googleUser = null;
    let accountId = null;
    const session = await getSession({ req });

    if (session || req.body.api_app_id || req.query.slack) {
      if (session) {
        accountId = session.userId as string;
        googleUser = await getGoogleUser(accountId);
      }

      if (googleUser || req.body.api_app_id) {
        const workouts = await getLeaderboard({
          age: 30,
        });

        const shappedWorkouts = workouts.map((item: LeaderboardUsers) => {
          return {
            ...item,
            totalTime: prettyTime(item.totalTime),
          };
        });

        if (req.body.api_app_id || req.query.slack) {
          const jsonResponse = { blocks: [] };

          jsonResponse.blocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*These are the top athletes for Hipcamp Strava based on milage in the last 30 days!*`,
            },
          });

          workouts.map((item: LeaderboardUsers, i: number) => {
            const place = i + 1;
            jsonResponse.blocks.push({
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*${place}*: *${item.user.name}* - *${
                  item.totalDistance
                } miles*, with ${item.totalActivities} ${
                  item.totalActivities > 1 ? `workouts` : `workout`
                } for a duration of ${prettyTime(item.totalTime)}*`,
              },
            });
          });

          res.json(jsonResponse);
        } else {
          res.json({ users: shappedWorkouts });
        }
      } else {
        res.status(500).json({ error: `Could not find user ${accountId}` });
      }
    } else {
      res.status(401).json({ error: "Not Authorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: `Unknown Error` });
  }
}
