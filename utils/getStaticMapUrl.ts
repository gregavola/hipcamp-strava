export function getStaticMapUrl(summary_polyline?: string) {
  const staticGoogleImageUrl = `https://maps.googleapis.com/maps/api/staticmap?scale=2&size=500x500&maptype=roadmap&path=enc:${summary_polyline}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  return staticGoogleImageUrl;
}
