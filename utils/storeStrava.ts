import { connectDB } from "./db";

export async function addStravaResponse({ userId, activityId, jsonData }) {
  const db = await connectDB();
  const stravaCollection = await db.collection("stravaRequests");

  const doc = {
    activityId,
    userId,
    jsonData,
    createdAt: new Date(),
  };

  const response = await stravaCollection.insertOne(doc);

  return { status: "ok", strava: jsonData, response };
}
