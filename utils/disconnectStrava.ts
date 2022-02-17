import { connectDB } from "./db";

export async function disconnectStrava({ accountId }) {
  const db = await connectDB();
  const userCollection = await db.collection("users");

  const userQuery = { accountId };
  const userUpdateQuery = {
    $set: {
      accessToken: null,
      updatedAt: new Date(),
    },
  };

  const options = { upsert: true };
  const response = await userCollection.updateOne(
    userQuery,
    userUpdateQuery,
    options
  );

  return { status: "ok" };
}
