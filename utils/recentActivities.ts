import { subDays } from "date-fns";
import { connectDB } from "./db";
import { Stats } from "./types";

const generateTimezoneOffset = (rawOffset: number) => {
  const prefix = rawOffset >= 0 ? "+" : "-";
  const d = Math.abs(rawOffset);

  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);
  return `${prefix}${h < 9 ? `0${h}` : h}:${m < 9 ? `0${m}` : m}`;
};

export async function getActivites({
  userId,
  limit,
}: {
  userId: number;
  limit?: number;
}) {
  const db = await connectDB();
  const activitiesCollection = await db.collection("activities");

  const lastOffset = await activitiesCollection
    .find({ "user.userId": userId })
    .limit(1)
    .sort({ created_at: -1 });

  let lastKnownOffset = 0;

  await lastOffset.forEach((doc) => {
    lastKnownOffset = doc.utcOffset;
  });

  const utcOffset =
    lastKnownOffset === 0 ? "+00:00" : generateTimezoneOffset(lastKnownOffset);

  const last30Days = subDays(new Date(), 30);

  const cursor = await activitiesCollection.aggregate([
    {
      $match: {
        "user.userId": userId,
      },
    },
    {
      $group: {
        _id: {
          created_at: {
            $dateToString: {
              timezone: utcOffset,
              format: "%Y-%m-%d",
              date: "$created_at",
            },
          },
        },
        items: {
          $push: {
            activityId: "$activityId",
            created_at: "$created_at",
            elapsedTime: "$elapsedTime",
            name: "$name",
            distance: "$distance",
            type: "$type",
            user: "$user",
          },
        },
        totalWorkouts: { $sum: 1 },
        totalTime: { $sum: "$elapsedTime" },
        totalDistance: { $sum: "$distance" },
      },
    },
    {
      $addFields: {
        createdAt: "$_id.created_at",
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $limit: limit | 15,
    },
    {
      $project: {
        _id: false,
        totalWorkouts: "$totalWorkouts",
        totalTime: "$totalTime",
        totalDistance: "$totalDistance",
        date: "$_id.created_at",
        items: "$items",
      },
    },
  ]);

  const cursorStats = await activitiesCollection.aggregate([
    {
      $match: {
        "user.userId": userId,
      },
    },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalTime: { $sum: "$elapsedTime" },
        totalDistance: { $sum: "$distance" },
      },
    },
    {
      $project: {
        _id: false,
      },
    },
  ]);

  const cursorStatsRecent = await activitiesCollection.aggregate([
    {
      $match: {
        "user.userId": userId,
        created_at: {
          $gte: last30Days,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalWorkouts: { $sum: 1 },
        totalTime: { $sum: "$elapsedTime" },
        totalDistance: { $sum: "$distance" },
      },
    },
    {
      $project: {
        _id: false,
      },
    },
  ]);

  const statsBlock: Stats = {
    totalWorkouts: 0,
    totalTime: 0,
    totalDistance: 0,
  };

  const activitiesMap = {
    stats: {
      allTime: statsBlock,
      last30Days: statsBlock,
    },
    workouts: [],
  };

  await cursor.forEach((doc) => {
    activitiesMap.workouts.push(doc);
  });

  await cursorStats.forEach((doc) => {
    activitiesMap.stats.allTime = doc as Stats;
  });

  await cursorStatsRecent.forEach((doc) => {
    activitiesMap.stats.last30Days = doc as Stats;
  });

  return activitiesMap;
}
