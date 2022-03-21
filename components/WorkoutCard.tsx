import { format } from "date-fns";
import React from "react";
import { Workout } from "../utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRunning, faBiking } from "@fortawesome/free-solid-svg-icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { distanceConverter } from "../utils/distanceConverter";
import { prettyTime } from "../utils/prettyTime";
import { faStrava } from "@fortawesome/free-brands-svg-icons";

export interface DefaultProps {
  workout: Workout;
}

function WorkoutCard({ workout }: DefaultProps) {
  const faPropIconRunning = faRunning as IconProp;
  const faPropIconBiking = faBiking as IconProp;

  return (
    <div className="card p-3 mb-3">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="image" style={{ marginRight: 15, width: 45 }}>
            {workout.type === "Run" && (
              <FontAwesomeIcon
                icon={faPropIconRunning}
                size={"2x"}
                className="mr-3"
              />
            )}

            {workout.type === "Ride" && (
              <FontAwesomeIcon
                icon={faPropIconBiking}
                size={"2x"}
                className="mr-3"
              />
            )}
          </div>
          <div className="info ml-3">
            <div style={{ fontSize: 16, fontWeight: "bold" }}>
              {workout.name}
            </div>
            <div
              className="text-uppercase"
              style={{
                letterSpacing: 1,
                fontSize: 13,
              }}
            >
              Duration: {prettyTime(workout.elapsedTime)}
            </div>
            <div
              className="text-muted"
              style={{
                letterSpacing: 1,
                fontSize: 12,
                marginTop: 0,
                marginBottom: 0,
              }}
            >
              {workout.created_at && (
                <>
                  <div>
                    {format(
                      new Date(workout.created_at),
                      "E, LLL do @ h:mm aaa"
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="d-sm-block d-md-block d-xl-none d-lg-none">
              <div className="workout d-flex align-items-center p-1 mt-1 mb-1 justify-content-center">
                <h3>{distanceConverter(workout.distance)}</h3>
                <span className="text-muted ml-1">mi</span>
              </div>
              <div className="w-100 mx-auto">
                <a
                  className="btn strava-color btn-sm text-uppercase w-100 text-center"
                  target="_blank"
                  href={`https://strava.com/activities/${workout.activityId}`}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="mr-5">
                      <FontAwesomeIcon
                        icon={faStrava}
                        size={"lg"}
                        className="mr-3"
                      />
                    </div>
                    <div style={{ marginLeft: 10, textAlign: "center" }}>
                      Strava
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="d-none d-lg-block d-xl-block">
          <div className="workout d-flex align-items-center justify-content-center">
            <h3>{distanceConverter(workout.distance)}</h3>
            <span className="text-muted ml-1">mi</span>
          </div>
          <div className="w-100 mx-auto">
            <a
              className="btn strava-color btn-sm text-uppercase"
              target="_blank"
              href={`https://strava.com/activities/${workout.activityId}`}
            >
              <div className="d-flex align-items-center">
                <div className="mr-5">
                  <FontAwesomeIcon
                    icon={faStrava}
                    size={"lg"}
                    className="mr-3"
                  />
                </div>
                <div style={{ marginLeft: 10 }}>Strava</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCard;
