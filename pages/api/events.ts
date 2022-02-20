import type { NextApiRequest, NextApiResponse } from "next";
import { getLeaderboard } from "../../utils/getLeaderboard";
import { prettyTime } from "../../utils/prettyTime";
import { LeaderboardUsers } from "../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.event) {
    const eventType = req.body.event.type;
    const text = req.body.event.text;

    if (eventType == "app_mention") {
      if (text.toLowerCase().indexOf("leaderboard") !== -1) {
        const workouts = await getLeaderboard({
          age: 30,
        });

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
              } for a duration of *${prettyTime(item.totalTime)}*`,
            },
          });
        });

        res.json(jsonResponse);
      } else {
        res.json({
          text: `${text}: ${text.toLowerCase().indexOf("leaderboard")}`,
        });
      }
    } else {
      res.json({ text: `${eventType} is not supported` });
    }
  } else {
    res.json({
      status: "OK",
      challenge: req.body.challenge,
      text: "Nothing to see here",
    });
  }
}
