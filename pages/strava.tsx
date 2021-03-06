import Head from "next/head";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStrava } from "@fortawesome/free-brands-svg-icons";

import { useSession, signOut, getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Activities,
  ActivityStats,
  FullStravaUser,
  GoogleProps,
  LeaderboardResponse,
  LeaderboardUsers,
  Workout,
} from "../utils/types";
import { addGoogleUser } from "../utils/crudAuth";
import { getGoogleUser } from "../utils/getGoogleUser";
import { getAPIActivities, getAPILeaderboard } from "../utils/http";
import WorkoutCard from "../components/WorkoutCard";
import { parseISO, format } from "date-fns";
import StatsGrid from "../components/StatsGrid";
import { updateUser } from "../utils/updateUser";
import UserCard from "../components/UserCard";

export default function StravaPage({ sessionData, googleUser }) {
  const router = useRouter();
  const [postActivity, setPostActivity] = useState(1);
  const [isSuccessUserSave, setIsSuccessUserSave] = useState(null);
  const [mapOnly, setMapOnly] = useState(1);
  const [slackUsername, setSlackUsername] = useState("");
  const [hasStravaConnected, setHasStavaConnected] = useState(false);
  const [activityStats, setActivityStats] = useState<ActivityStats>({
    workouts: [],
    stats: null,
  });
  const [leaderboardStats, setLeaderboardStats] = useState<LeaderboardResponse>(
    {
      users: [],
    }
  );
  const [isLoadingActivityStats, setIsLoadingActivityStats] = useState(true);
  const [isLoadingLeaderboardStats, setIsLoadingLeaderboardStats] =
    useState(true);
  const [isSavingUser, setIsSavingUser] = useState(false);
  const [isError, setIsError] = useState(null);

  const postActivitiesMap = {
    1: "Don't Share",
    2: "Runs & Rides",
    3: "Runs Only",
    4: "Rides Only",
  };

  const googleUserData: FullStravaUser = googleUser
    ? JSON.parse(googleUser)
    : null;

  useEffect(() => {
    if (googleUserData) {
      setPostActivity(googleUserData.postActivity);
      setMapOnly(googleUserData.mapOnly);
      setSlackUsername(googleUserData.slackUsername || "");
      setHasStavaConnected(googleUserData.accessToken ? true : false);
      getActivites();
      getLeaderboard();
    }
  }, []);

  const updateUsername = async () => {
    setIsError(false);
    setIsSavingUser(true);
    try {
      const response = await axios.post(`/api/update`, { slackUsername });
      setIsSavingUser(false);
      setIsSuccessUserSave("Great! Your display name has been updated.");
      setTimeout(() => {
        setIsSuccessUserSave(null);
      }, 3000);
    } catch (err) {
      setIsSavingUser(false);
      setIsError("Something went wrong, please try again.");
      console.log(err);
    }
  };

  const removeUsername = async () => {
    const oldSlackUsername = slackUsername;
    setSlackUsername("");
    setIsError(false);
    setIsSavingUser(true);
    try {
      const response = await axios.post(`/api/update`, {
        removeSlackUsername: true,
      });
      setIsSavingUser(false);
      setIsSuccessUserSave("Great! Your custom display name has removed.");
      setTimeout(() => {
        setIsSuccessUserSave(null);
      }, 3000);
    } catch (err) {
      setSlackUsername(oldSlackUsername);
      setIsSavingUser(false);
      setIsError("Something went wrong, please try again.");
      console.log(err);
    }
  };

  const handleTextChange = (e) => {
    setSlackUsername(e.target.value);
  };

  const handleChange = async (e) => {
    const oldValuePost = postActivity;
    setPostActivity(e);
    setIsError(false);

    try {
      const response = await axios.post(`/api/update`, { postActivity: e });
    } catch (err) {
      setPostActivity(oldValuePost);
      setIsError("Something went wrong, please try again.");
      console.log(err);
    }
  };

  const getActivites = async () => {
    try {
      const data = await getAPIActivities();
      setIsLoadingActivityStats(false);
      setActivityStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const getLeaderboard = async () => {
    try {
      const data = await getAPILeaderboard();
      setIsLoadingLeaderboardStats(false);
      setLeaderboardStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  const disconnectStrava = async () => {
    setHasStavaConnected(false);
    setIsError(false);

    try {
      const response = await axios.post(`/api/disconnect`);
    } catch (err) {
      setHasStavaConnected(true);
      setIsError("Something went wrong, please try again.");
      console.log(err);
    }
  };

  const handleMapChange = async (e) => {
    const oldValue = mapOnly;
    setMapOnly(e);
    setIsError(false);
    try {
      const response = await axios.post(`/api/update`, { mapOnly: e });
    } catch (err) {
      setMapOnly(oldValue);
      console.log(err);
      setIsError("Something went wrong, please try again.");
    }
  };

  return (
    <div>
      <Head>
        <title>Hipcamp Strava - Account</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar bg="light" expand="lg">
        <div className="container justify-content-between align-item-center">
          <h3 className="fw-bold">Hipcamp Strava</h3>
          <div className="d-flex align-items-center justify-content-end">
            <Button
              variant="outline-primary"
              onClick={() => {
                signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}` });
              }}
            >
              Log Out
            </Button>
          </div>
        </div>
      </Navbar>

      <div className="container justify-content-center d-flex vertical-center">
        {router.query.error && (
          <Alert variant="danger" className="text-center">
            ???? An error occurred when you tried to authenticate you with Strava.
            Please try again. ????
          </Alert>
        )}

        <div className="d-flex justify-content-center mb-3">
          <img
            src={sessionData.user.image}
            width="100"
            height="100"
            className="mr-1 rounded-circle"
            alt={sessionData.user.name}
          />
        </div>
        <h1 className={styles.title}>???? Hello, {sessionData.user.name}!</h1>

        {router.query.success && (
          <Alert variant={"warning"} className="mt-3">
            <div className={styles.description}>
              ???? You did it! You have a linked your Strava account to Hipcamp
              Run Club! Now, every ride or run will be shared the the{" "}
              <span className="text-primary">#running-biking-club</span> Channel
              in Slack. You can configure this in the option below.
            </div>
          </Alert>
        )}

        <div className="container">
          {isError && (
            <Alert variant="danger" className="text-center">
              {isError}
            </Alert>
          )}

          {isSuccessUserSave && (
            <Alert variant="success" className="text-center">
              {isSuccessUserSave}
            </Alert>
          )}

          {hasStravaConnected && (
            <>
              <div className="mt-3">
                <h3>Settings</h3>
                <div className="">
                  <div style={{ marginTop: 10, marginBottom: 10 }}>
                    Display Name
                  </div>
                  <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <div className="d-flex">
                        <Form.Control
                          type="text"
                          onChange={handleTextChange}
                          style={{ marginRight: 10 }}
                          placeholder="Enter a Display Name"
                          defaultValue={slackUsername}
                        />
                        {slackUsername !== "" && (
                          <Button
                            className="me-1"
                            variant="danger"
                            disabled={isSavingUser}
                            onClick={removeUsername}
                          >
                            Remove
                          </Button>
                        )}

                        <Button
                          variant="primary"
                          disabled={isSavingUser}
                          onClick={updateUsername}
                        >
                          Save
                        </Button>
                      </div>

                      <Form.Text className="text-muted mt-3 d-block">
                        When we share an activity, we will use your name defined
                        by your Strava account ({sessionData.user.name}). If you
                        want to display something different, please add a value
                        above.
                      </Form.Text>
                    </Form.Group>
                  </Form>
                </div>
              </div>
              <hr />
              <div className="mt-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div style={{ marginRight: 10 }}>Activites to Share</div>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-primary">
                      {postActivitiesMap[postActivity]}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      {Object.keys(postActivitiesMap).map(
                        (keyName, keyIndex) => {
                          return (
                            <Dropdown.Item
                              key={keyIndex}
                              onClick={() => {
                                handleChange(keyName);
                              }}
                            >
                              {postActivitiesMap[keyName]}
                            </Dropdown.Item>
                          );
                        }
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div style={{ marginRight: 10 }}>
                    Share Peloton Activites?
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-primary">
                      {mapOnly === 1 ? "Yes" : "No"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          handleMapChange(1);
                        }}
                      >
                        Yes
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleMapChange(2);
                        }}
                      >
                        No
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              <hr />
              <div className="mt-3">
                <h3>Stats</h3>
                {isLoadingActivityStats && (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                  </div>
                )}
                {!isLoadingActivityStats &&
                  activityStats &&
                  activityStats.stats && (
                    <>
                      <StatsGrid
                        stats={activityStats.stats.allTime}
                        title={"All Time"}
                      />
                      <hr />
                      <StatsGrid
                        stats={activityStats.stats.last30Days}
                        title={"Last 30 Days"}
                      />
                    </>
                  )}
              </div>

              <hr />
              <div className="mt-3">
                <h3>Leaderboard</h3>
                {isLoadingLeaderboardStats && (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                  </div>
                )}

                {!isLoadingLeaderboardStats &&
                  leaderboardStats?.users?.length === 0 && (
                    <div className="d-flex justify-content-center">
                      <strong>No leaderboard at this time!</strong>
                    </div>
                  )}

                {!isLoadingLeaderboardStats &&
                  leaderboardStats.users.length !== 0 && (
                    <div className="mt-3">
                      <div className="mb-3 text-muted">
                        This leaderboard shows the top users based on distance,
                        in the last 30 days.
                      </div>
                      {leaderboardStats.users.map(
                        (item: LeaderboardUsers, keyIndex: number) => {
                          return (
                            <UserCard user={item} key={`user-${keyIndex}`} />
                          );
                        }
                      )}
                    </div>
                  )}
              </div>

              <hr />
              <div className="mt-3">
                <h3>Activites</h3>
                {isLoadingActivityStats && (
                  <div className="d-flex justify-content-center">
                    <Spinner animation="border" />
                  </div>
                )}

                {!isLoadingActivityStats &&
                  activityStats?.workouts?.length === 0 && (
                    <div className="d-flex justify-content-center">
                      <strong>You have no workouts.</strong>
                    </div>
                  )}

                {!isLoadingActivityStats &&
                  activityStats.workouts.length !== 0 && (
                    <>
                      {activityStats.workouts.map(
                        (item: Activities, keyIndex: number) => {
                          return (
                            <div className="mt-3" key={`date-${keyIndex}`}>
                              <h6 className="text-muted mb-3">
                                {format(
                                  parseISO(item.date),
                                  "iiii, LLLL do yyyy"
                                )}
                              </h6>
                              {item.items.map((workout: Workout) => {
                                return (
                                  <WorkoutCard
                                    key={workout.activityId}
                                    workout={workout}
                                  />
                                );
                              })}
                            </div>
                          );
                        }
                      )}
                    </>
                  )}
              </div>
            </>
          )}
          {!hasStravaConnected && (
            <div className={styles.description}>
              To get started, tap the button below to authenticate your Strava
              account! When you link your account, all new rides and runs that
              you create on Strava, will be auto-published to{" "}
              <span className="text-primary">#running-biking-club</span> on
              Slack.
            </div>
          )}
        </div>

        {hasStravaConnected && (
          <div className="container mt-5">
            <h3>Connected Strava Account</h3>

            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <div>
                  <img
                    src={googleUserData.avatar}
                    width="50"
                    height="50"
                    className="mr-1 rounded-circle"
                    alt={googleUserData.avatar}
                  />
                </div>
                <div className="mb-0 mx-3">
                  {googleUserData.name} ({googleUserData.userName})
                </div>
              </div>
              <Button
                variant="danger"
                onClick={() => {
                  disconnectStrava();
                }}
              >
                Disconnect
              </Button>
            </div>
          </div>
        )}
        {!hasStravaConnected && (
          <div className="d-flex justify-content-center">
            <Button
              className="strava-color d-flex align-items-center"
              size="lg"
              onClick={() => {
                router.push("/api/strava");
              }}
            >
              <div className="mr-5">
                <FontAwesomeIcon icon={faStrava} size={"lg"} className="mr-3" />
              </div>
              <div style={{ marginLeft: 10 }}>Connect with Strava</div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  try {
    const session = await getSession(ctx);

    if (session) {
      const userParams: GoogleProps = {
        accountId: session.userId as string,
        googleName: session.user.name,
        googleAvatar: session.user.image,
        email: session.user.email,
      };

      await addGoogleUser(userParams);

      const googleUser = await getGoogleUser(session.userId as string);

      return {
        props: {
          googleUser: JSON.stringify(googleUser),
          sessionData: session,
        },
      };
    } else {
      return {
        redirect: {
          permanent: false,
          destination: "/?loginRequired=true",
        },
      };
    }
  } catch (err) {
    console.log(err);
  }
}
