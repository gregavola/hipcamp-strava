const polyline = require("@mapbox/polyline");
const mbxClient = require("@mapbox/mapbox-sdk");
var merge = require("lodash.merge");
var simplify = require("simplify-geojson");

const encodeGeoJsonOverlay = (geojson: any) => {
  return `geojson(${encodeURIComponent(JSON.stringify(geojson))})`;
};

export function getStaticMapUrl(summary_polyline?: string) {
  const staticGoogleImageUrl = `https://maps.googleapis.com/maps/api/staticmap?scale=2&size=750x750&maptype=roadmap&path=enc:${summary_polyline}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

  return staticGoogleImageUrl;
}
