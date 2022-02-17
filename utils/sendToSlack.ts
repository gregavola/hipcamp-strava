import { connectDB } from "./db";
import { ActivityProps, SlackProps } from "./types";
import { WebClient } from "@slack/web-api";
import { getStaticMapUrl } from "./getStaticMapUrl";

const distanceConverter = (distance: number) => {
  const kmValue = distance / 1000;
  return (kmValue * 0.621371).toFixed(2);
};

const generateMessage = (activity: ActivityProps) => {
  return `*${activity.user.name}* just completed a *${distanceConverter(
    activity.distance
  )} mile* ${activity.type} - ${activity.name.trim()}!`;
};

export async function sendToSlack({
  activityId,
  summaryPolyline,
  activityType,
  postActivity,
  mapOnly,
}: SlackProps) {
  let message = "";
  const db = await connectDB();

  const activityCollection = await db.collection("activities");
  const activity = await activityCollection.findOne({ activityId });

  if (!activity) {
    throw new Error(`Activity Not Found ${activityId}`);
  }

  const webApi = new WebClient(process.env.SLACK_BOT_TOKEN);

  const slackSendsCollection = await db.collection("slackSends");

  try {
    message = await generateMessage(activity as unknown as ActivityProps);
    if (message !== "") {
      let attachments = [];
      let blocks = [];

      if (summaryPolyline) {
        attachments.push({
          title: "Map",
          image_url: getStaticMapUrl(summaryPolyline),
        });
      }

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: message,
        },
      });

      blocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `<https://www.strava.com/activities/${activity.activityId}|View ${activity.type} on Strava>`,
        },
      });

      if (mapOnly == 2 && !summaryPolyline) {
        return;
      }

      if (postActivity == 1) {
        return;
      }

      if (postActivity == 3 && activityType == "Bike") {
        return;
      }

      if (postActivity == 4 && activityType == "Run") {
        return;
      }

      const slackResponse = await webApi.chat.postMessage({
        text: "New Strava Post!",
        channel: process.env.SLACK_CHANNEL_ID || "",
        attachments: attachments,
        blocks,
      });

      const response = await slackSendsCollection.insertOne({
        activityId,
        message,
        activity,
        slackResponse,
        errorMessage: null,
        status: 200,
        createdAt: new Date(),
      });
    } else {
      throw new Error(`Message was blank for ${activityId}`);
    }
  } catch (exc) {
    const response = await slackSendsCollection.insertOne({
      activityId,
      message,
      activity,
      slackResponse: null,
      errorMessage: exc.message,
      status: 500,
      createdAt: new Date(),
    });

    console.error(exc.message);
    throw new Error(exc);
  }
}
