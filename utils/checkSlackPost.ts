import { connectDB } from "./db";

export async function checkSlackPost({ activityId }: { activityId: number }) {
  const db = await connectDB();
  const slackSendsCollection = await db.collection("slackSends");

  const cursor = await slackSendsCollection
    .find({ activityId })
    .sort({ createdAt: -1 })
    .limit(1);

  let data = null;

  await cursor.forEach((doc) => {
    data = doc;
  });

  console.log(data);

  if (!data) {
    return true;
  } else {
    return data.status == 200 ? false : true;
  }
}
