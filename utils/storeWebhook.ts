import { connectDB } from "./db";

export async function addWebhookResponse({ userId, activityId, jsonData }) {
  const db = await connectDB();
  const webhookCollection = await db.collection("webhooks");

  const doc = {
    activityId,
    userId,
    jsonData,
    createdAt: new Date(),
  };

  const response = await webhookCollection.insertOne(doc);

  return { status: "ok", webhook: jsonData, response };
}
