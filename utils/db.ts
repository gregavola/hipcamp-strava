import * as mongoDB from "mongodb";

export async function connectDB() {
  const client: mongoDB.MongoClient = new mongoDB.MongoClient(
    process.env.MONGO_CONNECTION_URI || ""
  );

  await client.connect();

  const db: mongoDB.Db = client.db(process.env.MONGO_DB_NAME);

  return db;
}
