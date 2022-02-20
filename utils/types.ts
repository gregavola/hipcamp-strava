export interface UserProps {
  name: string;
  userId: number;
  accountId?: string;
  userName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  avatar: string;
  postActivity?: number;
  mapOnly?: number;
}

export interface GoogleProps {
  googleName: string;
  googleAvatar: string;
  email: string;
  accountId: string;
  postActivity?: number;
  mapOnly?: number;
}

export interface MiniUser {
  name: string;
  userId: number;
  userName: string;
  avatar: string;
}

export interface LeaderboardUsers {
  user: MiniUser;
  totalDistance: number;
  totalTime: number;
  totalActivities: number;
}

export interface SlackProps {
  activityId: number;
  activityType: string;
  summaryPolyline?: string;
  postActivity: number;
  mapOnly: number;
}

export interface RefreshTokenProps {
  userId: number;
  accessToken?: string;
  refreshToken: string;
  expiresAt?: number;
}

export interface UserUpdateProps {
  accountId: string;
  postActivity?: number;
  mapOnly?: number;
}

export interface FullStravaUser extends GoogleProps {
  avatar?: string;
  name?: string;
  userName?: string;
  accessToken?: string;
  userId?: number;
}

export interface ActivityProps {
  activityId: number;
  name: string;
  type: string;
  user: MiniUser;
  distance: number;
  startDate: string;
  utcOffset: number;
  elapsedTime: number;
}

export interface StravaWebhook {
  object_type: string;
  object_id: number;
  aspect_type: string;
  updates: any;
  owner_id: number;
  subscription_id: number;
  event_time: number;
}
