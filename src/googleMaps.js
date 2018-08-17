export const GMAPS_API_KEY = "AIzaSyANz7z1Egs60S8UEclVPBzxwRWvsCimJIk";

export function geocode(place_name, reportError) {
  const query =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?key=${GMAPS_API_KEY}` +
    `&address=${place_name + ", San Francisco, CA"}`;
  return fetch(query)
    .then(result => result.json())
    .then(json => json.results[0])
    .catch(error => reportError("Unable to retrieve location information."));
}