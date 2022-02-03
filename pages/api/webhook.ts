import type { NextApiRequest, NextApiResponse } from "next";
import strava from "strava-v3";
import { checkTokenExpire } from "../../utils/checkTokenExpire";
import { crudActities } from "../../utils/crudActivities";
import { connectDB } from "../../utils/db";
import { getUser } from "../../utils/getUser";
import { handleRefreshToken } from "../../utils/handleRefreshToken";
import { sendToSlack } from "../../utils/sendToSlack";
import { StravaWebhook, UserProps } from "../../utils/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let activityData = null;
  const responseBody = req.body as StravaWebhook;

  try {
    if (
      responseBody.aspect_type == "create" &&
      responseBody.object_type == "activity"
    ) {
      const userId = responseBody.owner_id;
      let userData = (await getUser(userId)) as unknown as UserProps;

      console.log(userData);

      if (!userData) {
        console.log(`No Data on ${userId} found`);
      } else {
        const tokenExpired = checkTokenExpire(userData.expiresAt);

        if (tokenExpired) {
          console.log(`Token Expired`);
          userData = await handleRefreshToken({
            userId: userData.userId,
            refreshToken: userData.refreshToken,
          });

          console.log(`UserData`);
          console.log(userData);
        }

        const activityId = responseBody.object_id;

        console.log(`querying ${userId}`);
        activityData = await strava.activities.get({
          access_token: userData?.accessToken,
          id: activityId,
        });

        if (activityData) {
          await crudActities({
            activityId: activityData.id,
            name: activityData.name,
            type: activityData.type,
            distance: activityData.distance,
            startDate: activityData.start_date,
            utcOffset: activityData.utc_offset,
            user: {
              userId,
              name: userData.name,
              userName: userData.userName,
              avatar: userData.avatar,
            },
            elapsedTime: activityData.elapsed_time,
          });

          await sendToSlack({
            activityId,
            summaryPolyline: activityData.map?.summary_polyline,
          });
        }
      }
    }
  } catch (ex) {
    console.log(ex.message);
  }

  res.json({
    data: activityData,
    "hub.challenge": req.query["hub.challenge"],
    body: responseBody,
  });
}