
mapboxgl.accessToken = mapToken;

const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: 'map', // container ID
    center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 11 // starting zoom
});


const marker = new mapboxgl.Marker({ color: 'red' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 })
    .setText(listing.location   ))
    .addTo(map);

