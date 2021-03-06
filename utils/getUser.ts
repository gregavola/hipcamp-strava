import { connectDB } from "./db";

export async function getUser(userId: number) {
  const db = await connectDB();
  const userCollection = await db.collection("users");

  const response = await userCollection.findOne({ userId });

  return response;
}
