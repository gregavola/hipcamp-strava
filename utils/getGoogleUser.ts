import { connectDB } from "./db";

export async function getGoogleUser(accountId: string) {
  const db = await connectDB();
  const userCollection = await db.collection("users");

  const response = await userCollection.findOne({ accountId });

  return response;
}
