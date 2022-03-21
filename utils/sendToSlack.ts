import { connectDB } from "./db";
import { ActivityProps, SlackProps } from "./types";
import { WebClient } from "@slack/web-api";
import { getStaticMapUrl } from "./getStaticMapUrl";
import { checkSlackPost } from "./checkSlackPost";
import { distanceConverter } from "./distanceConverter";

const generateMessage = (activity: ActivityProps, slackUsername: string) => {
  // is the username is not defined, fall back to the activity user name

  const nameDisplayed = slackUsername || activity.user.name;

  return `*${nameDisplayed}* just completed a *${distanceConverter(
    activity.distance
  )} mile* ${activity.type} - ${activity.name.trim()}!`;
};

export async function sendToSlack({
  activityId,
  summaryPolyline,
  activityType,
  postActivity,
  mapOnly,
  slackUsername,
}: SlackProps) {
  let message = "";
  let startInit, endInit;
  const db = await connectDB();

  const { performance } = require("perf_hooks");

  const activityCollection = await db.collection("activities");
  const activity = await activityCollection.findOne({ activityId });

  if (!activity) {
    throw new Error(`Activity Not Found ${activityId}`);
  }

  const shouldSendToSlack = await checkSlackPost({ activityId });

  // do not send, if it's already been posted
  if (!shouldSendToSlack) {
    console.log(`${activityId} has already been sent!`);
    return;
  }

  const webApi = new WebClient(process.env.SLACK_BOT_TOKEN);

  const slackSendsCollection = await db.collection("slackSends");

  try {
    message = await generateMessage(
      activity as unknown as ActivityProps,
      slackUsername
    );
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

      startInit = performance.now();

      const slackResponse = await webApi.chat.postMessage({
        text: "New Strava Post!",
        unfurl_links: false,
        channel: process.env.SLACK_CHANNEL_ID || "",
        attachments: attachments,
        blocks,
      });

      endInit = performance.now();

      const timeTaken = parseFloat((endInit - startInit).toFixed(2));

      const response = await slackSendsCollection.insertOne({
        activityId,
        message,
        activity,
        slackResponse,
        errorMessage: null,
        status: 200,
        timeTaken,
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
