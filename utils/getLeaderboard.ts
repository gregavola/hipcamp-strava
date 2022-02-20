import { connectDB } from "./db";
import subDays from "date-fns/subDays";
import { LeaderboardUsers } from "./types";
import { distanceConverter } from "./distanceConverter";

export async function getLeaderboard({ age }: { age?: number }) {
  const db = await connectDB();
  const activitiesCollection = await db.collection("activities");

  const endDate = subDays(new Date(), age || 30);

  console.log(endDate);

  const cursor = await activitiesCollection.aggregate([
    {
      $match: {
        created_at: {
          $gte: endDate,
        },
      },
    },
    {
      $group: {
        _id: "$user.userId",
        numberOfMiles: { $sum: "$distance" },
        user: { $first: "$user" },
        totalActivites: { $sum: 1 },
        totalTime: { $sum: "$elapsedTime" },
      },
    },
    {
      $sort: {
        numberOfMiles: -1,
      },
    },
  ]);

  const activitiesMap: LeaderboardUsers[] = [];

  await cursor.forEach((doc) => {
    activitiesMap.push({
      user: doc.user,
      totalDistance: distanceConverter(doc.numberOfMiles),
      totalActivities: doc.totalActivites,
      totalTime: doc.totalTime,
    });
  });

  return activitiesMap;
}
