import { connectDB } from "./db";
import { GoogleProps } from "./types";

export async function addGoogleUser({
  googleName,
  accountId,
  email,
  googleAvatar,
}: GoogleProps) {
  const db = await connectDB();
  const userCollection = await db.collection("users");

  const userQuery = { accountId };
  const userUpdateQuery = {
    $setOnInsert: { created_at: new Date(), postActivity: 1, mapOnly: 1 },
    $set: {
      googleName,
      email,
      googleAvatar,
      updatedAt: new Date(),
    },
  };

  const options = { upsert: true };
  const response = await userCollection.updateOne(
    userQuery,
    userUpdateQuery,
    options
  );

  return response;
}
