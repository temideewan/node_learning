/* eslint-disable */
console.log('Hello from the client side');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoidGVtaWRlZXdhbiIsImEiOiJjbHNhNTY3b3owMDJzMmtsaDc5YWhwYjdvIn0.Kfpn4V4mhhlmHcz1cpg1Hg';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/temideewan/clscw31wm00gx01qz3ipgh1nh', // style URL
	scrollZoom: false,
  // center: [-118.113491, 34], // starting position [lng, lat]
  // zoom: 9, // starting zoom
  // interactive: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom',
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

	// add popup
	new mapboxgl.Popup({
		offset: 25
	}).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`).addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
