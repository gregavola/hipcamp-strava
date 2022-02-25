import { connectDB } from "./db";
import { MiniUser } from "./types";

export async function getUsers() {
  const db = await connectDB();
  const userCollection = await db.collection("users");

  const cursor = await userCollection.find().sort({ createdAt: -1 });

  const users: MiniUser[] = [];

  await cursor.forEach((doc) => {
    users.push({
      userId: doc.userId,
      name: doc.googleName,
      userName: doc.userName,
      avatar: doc.googleAvatar || doc.avatar,
    });
  });

  return users;
}
