import React from "react";
import { LeaderboardUsers } from "../utils/types";
import { distanceConverter } from "../utils/distanceConverter";
import { prettyTime } from "../utils/prettyTime";

export interface DefaultProps {
  user: LeaderboardUsers;
}

function UserCard({ user }: DefaultProps) {
  return (
    <div className="card p-3 mb-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div
            className="image d-flex justify-content-center"
            style={{ marginRight: 15, width: 45 }}
          >
            <img
              src={user.user.avatar}
              height={50}
              width={50}
              className="rounded"
            />
          </div>
          <div className="info ml-3">
            <div style={{ fontSize: 16, fontWeight: "bold" }}>
              {user.user.name}
            </div>
            <div
              className="text-uppercase"
              style={{
                letterSpacing: 1,
                fontSize: 13,
              }}
            >
              Duration: {user.totalTime}
            </div>
            <div
              className="text-uppercase"
              style={{
                letterSpacing: 1,
                fontSize: 13,
              }}
            >
              Total {user.totalActivities > 1 ? `Workouts` : `Workout`}:{" "}
              {user.totalActivities}
            </div>
            <div
              className="text-muted"
              style={{
                letterSpacing: 1,
                fontSize: 12,
                marginTop: 0,
                marginBottom: 0,
              }}
            ></div>
            <div className="d-sm-block d-md-block d-xl-none d-lg-none">
              <div className="workout d-flex align-items-center p-1 mt-1 mb-1 justify-content-center">
                <h3>{user.totalDistance}</h3>
                <span className="text-muted ml-1">mi</span>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-lg-block d-xl-block">
          <div className="workout d-flex align-items-center justify-content-center">
            <h3>{user.totalDistance}</h3>
            <span className="text-muted ml-1">mi</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
