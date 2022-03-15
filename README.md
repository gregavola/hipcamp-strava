# hipcamp-strava

A simple NextJS app the cross posts workouts to our dedicated slack channel.

# Setup

In 1Password, there is an `.env` file under `Hipcamp-Strava` to pull down and use.

Simply run `npm run dev` (yes, this is a npm project, sorry), and it will be available on `localhost:3000` in your browser.

Please note that there is no dev database for this project, everything writes to production.

# Testing

There are no tests in this project 😢, however you can test out the `webhook` endpoint at `localhost:3000/api/webhook`, via Postman via a POST request with this params as the body:

```
{
    "aspect_type": "create",
    "event_time": 1516126040,
    "object_id": 6717822144,
    "object_type": "activity",
    "owner_id": 76141383,
    "subscription_id": 120475
}
```
