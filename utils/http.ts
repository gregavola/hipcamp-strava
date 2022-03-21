import axios from "axios";
import { ActivityStats } from "./types";

export function getAPIActivities(): Promise<ActivityStats> {
  return axios.get(`/api/activities`).then((response) => {
    return response.data;
  });
}
