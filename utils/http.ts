import axios from "axios";
import { ActivityStats, LeaderboardResponse } from "./types";

export function getAPIActivities(): Promise<ActivityStats> {
  return axios.get(`/api/activities`).then((response) => {
    return response.data;
  });
}

export function getAPILeaderboard(): Promise<LeaderboardResponse> {
  return axios.get(`/api/leaderboard`).then((response) => {
    return response.data;
  });
}
