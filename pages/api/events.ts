import type { NextApiRequest, NextApiResponse } from "next";
import { getLeaderboard } from "../../utils/getLeaderboard";
import { prettyTime } from "../../utils/prettyTime";
import { LeaderboardUsers, MiniUser } from "../../utils/types";
import { WebClient } from "@slack/web-api";
import { getUsers } from "../../utils/getUsers";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.body.event) {
    const eventType = req.body.event.type;
    const text = req.body.event.text;

    const webApi = new WebClient(process.env.SLACK_BOT_TOKEN);

    if (eventType == "app_mention") {
      if (text.toLowerCase().indexOf("users") !== -1) {
        const users = await getUsers();

        const jsonResponse = { blocks: [] };

        jsonResponse.blocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*The folowing are the Hipcamp Employees that have Signed Up!*`,
          },
        });

        users.map((item: MiniUser, i: number) => {
          jsonResponse.blocks.push({
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${item.name}*`,
            },
            accessory: {
              type: "image",
              image_url: item.avatar,
              alt_text: item.name,
            },
          });
        });

        const slackResponse = await webApi.chat.postMessage({
          text: "Current User List",
          unfurl_links: false,
          channel: process.env.SLACK_CHANNEL_ID || "",
          blocks: jsonResponse.blocks,
        });

        res.json({ status: "OK", slackResponse });
      } else if (text.toLowerCase().indexOf("leaderboard") !== -1) {
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

        const slackResponse = await webApi.chat.postMessage({
          text: "Current Leaderboard",
          unfurl_links: false,
          channel: process.env.SLACK_CHANNEL_ID || "",
          blocks: jsonResponse.blocks,
        });

        res.json({ status: "OK", slackResponse });
      } else {
        res.json({
          status: "OK",
        });
      }
    } else {
      res.json({ status: "OK", text: `${eventType} is not supported` });
    }
  } else {
    res.json({
      status: "OK",
      challenge: req.body.challenge,
      text: "Nothing to see here",
    });
  }
}
