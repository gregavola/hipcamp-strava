const polyline = require("@mapbox/polyline");
const mbxClient = require("@mapbox/mapbox-sdk");
var merge = require("lodash.merge");
var simplify = require("simplify-geojson");

const encodeGeoJsonOverlay = (geojson: any) => {
  return `geojson(${encodeURIComponent(JSON.stringify(geojson))})`;
};

export function getStaticMapUrl(summary_polyline?: string) {
  const lineFeature = polyline.toGeoJSON(summary_polyline);

  const actualGeoJSON = {
    type: "Feature",
    geometry: lineFeature,
    properties: { stroke: "#fc4c02" },
  };

  const lineFeatureSimple = simplify(actualGeoJSON, 0.0001);

  let width = 375;
  let height = 375;
  let baseMapStyle = "streets-v11";

  const encodedOverlays = encodeGeoJsonOverlay(lineFeatureSimple);
  const staticImageUrl = `https://api.mapbox.com/styles/v1/mapbox/${baseMapStyle}/static/${encodedOverlays}/auto/${width}x${height}@2x?access_token=${process.env.MAPBOX_API_KEY}&attribution=false&logo=false`;

  return staticImageUrl;
}
