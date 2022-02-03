export interface UserProps {
  name: string;
  userId: number;
  userName: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  avatar: string;
}

export interface MiniUser {
  name: string;
  userId: number;
  userName: string;
  avatar: string;
}

export interface SlackProps {
  activityId: number;
  summaryPolyline?: string;
}

export interface RefreshTokenProps {
  userId: number;
  accessToken?: string;
  refreshToken: string;
  expiresAt?: number;
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
