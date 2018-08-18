const FLICKR_API_KEY = "cc57b31ec1bb32af29cad9e5a13ddc09";

function bestFlickrPhotoForLocation({ lat, lng }) {
  const query =
    "https://api.flickr.com/services/rest/" +
    "?method=flickr.photos.search" +
    `&api_key=${FLICKR_API_KEY}` +
    "&sort=+relevance" +
    `&lat=${lat}&lon=${lng}&radius=0.3&radius_units=km` +
    "&per_page=1" +
    "&format=json&nojsoncallback=1";
  return fetch(query)
    .then(result => result.json())
    .then(json => json.photos.photo[0]);
}

function nsidToUsername(nsid) {
  const query =
    "https://api.flickr.com/services/rest/" +
    "?method=flickr.people.getInfo" +
    `&api_key=${FLICKR_API_KEY}` +
    `&user_id=${nsid}` +
    "&format=json&nojsoncallback=1";
  return fetch(query)
    .then(result => result.json())
    .then(json => json.person.username._content)
    .catch(error => "");
}

export function flickrForLocation({ lat, lng }, reportError) {
  const data = {};
  return bestFlickrPhotoForLocation({ lat, lng })
    .then(photo => {
      data.photoUrl = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${
        photo.secret
      }_n.jpg`;
      data.originalUrl = `https://www.flickr.com/photos/${photo.owner}/${photo.id}/`;
      data.title = photo.title;
      return nsidToUsername(photo.owner);
    })
    .then(username => {
      data.username = username;
      return data;
    })
    .catch(error => {
      reportError("Unable to retrieve photos from Flickr.");
      return data;
    });
}