import { connectDB } from "./db";
import { RefreshTokenProps, UserProps } from "./types";
import strava from "strava-v3";

export async function handleRefreshToken({
  userId,
  refreshToken,
}: RefreshTokenProps) {
  try {
    const db = await connectDB();
    const userCollection = await db.collection("users");

    strava.config({
      access_token: process.env.STRAVA_ACCESS_TOKEN || "",
      client_id: process.env.STRAVA_CLIENT_ID || "",
      client_secret: process.env.STRAVA_CLIENT_SECRET || "",
      redirect_uri: process.env.STRAVA_REDIRECT_URI || "",
    });

    const refreshResponse = await strava.oauth.refreshToken(refreshToken);

    console.log(refreshResponse);

    const userQuery = { userId };
    const userUpdateQuery = {
      $setOnInsert: { created_at: new Date() },
      $set: {
        updatedAt: new Date(),
        accessToken: refreshResponse.access_token,
        refreshToken: refreshResponse.refresh_token,
        expiresAt: refreshResponse.expires_at,
      },
    };

    const options = { upsert: true };
    const response = await userCollection.updateOne(
      userQuery,
      userUpdateQuery,
      options
    );

    console.log(response);

    const userData = await userCollection.findOne({ userId });

    return userData as unknown as UserProps;
  } catch (exc) {
    throw new Error(exc);
  }
}
