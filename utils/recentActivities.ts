import { connectDB } from "./db";

export async function getActivites({
  userId,
  limit,
}: {
  userId: number;
  limit?: number;
}) {
  const db = await connectDB();
  const activitiesCollection = await db.collection("activities");
  console.log(userId);
  const cursor = await activitiesCollection
    .find({ "user.userId": userId })
    .limit(limit || 15)
    .sort({ createdAt: -1 });

  const activitiesMap = [];

  await cursor.forEach((doc) => {
    activitiesMap.push(doc);
  });

  return activitiesMap;
}
