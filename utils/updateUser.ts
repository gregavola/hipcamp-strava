import { connectDB } from "./db";
import { UserUpdateProps } from "./types";

export async function updateUser({
  accountId,
  postActivity,
  mapOnly,
  slackUsername,
  removeSlackUsername,
}: UserUpdateProps) {
  const db = await connectDB();
  const userCollection = await db.collection("users");

  const userQuery = { accountId };
  const options = { upsert: true };

  if (removeSlackUsername) {
    const response = await userCollection.updateOne(
      userQuery,
      { $unset: { slackUsername: 1 } },
      options
    );
  } else {
    const userUpdateQuery = {
      $set: {
        ...(postActivity && {
          postActivity: parseInt(postActivity.toString()),
        }),
        ...(mapOnly && { mapOnly: parseInt(mapOnly.toString()) }),
        ...(slackUsername && { slackUsername }),
        updatedAt: new Date(),
      },
    };

    const response = await userCollection.updateOne(
      userQuery,
      userUpdateQuery,
      options
    );
  }

  return { status: "ok" };
}
