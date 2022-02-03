import { connectDB } from "./db";
import { ActivityProps } from "./types";

export async function crudActities({
  activityId,
  name,
  type,
  user,
  distance,
  startDate,
  utcOffset,
  elapsedTime,
}: ActivityProps) {
  const db = await connectDB();
  const activityCollection = await db.collection("activities");

  const activityQuery = { activityId };
  const activityUpdateQuery = {
    $setOnInsert: { created_at: new Date(startDate) },
    $set: {
      activityId,
      name,
      type,
      user,
      distance,
      utcOffset,
      elapsedTime,
      updatedAt: new Date(),
    },
  };

  const options = { upsert: true };
  const response = await activityCollection.updateOne(
    activityQuery,
    activityUpdateQuery,
    options
  );

  return response;
}
