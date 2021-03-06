import { connectDB } from "./db";
import { UserProps } from "./types";

export async function addUser({
  accountId,
  name,
  userId,
  accessToken,
  refreshToken,
  expiresAt,
  avatar,
  userName,
}: UserProps) {
  const db = await connectDB();
  const userCollection = await db.collection("users");

  const userQuery = { accountId };
  const userUpdateQuery = {
    $setOnInsert: { created_at: new Date() },
    $set: {
      name,
      userId,
      userName,
      updatedAt: new Date(),
      accessToken,
      refreshToken,
      expiresAt,
      avatar,
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
