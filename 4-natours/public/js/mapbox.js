/* eslint-disable */
console.log('Hello from the client side');

const locations = JSON.parse(document.getElementById('map').dataset.locations);

console.log(locations);

mapboxgl.accessToken = 'pk.eyJ1IjoidGVtaWRlZXdhbiIsImEiOiJjbHNhNTY3b3owMDJzMmtsaDc5YWhwYjdvIn0.Kfpn4V4mhhlmHcz1cpg1Hg';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/mapbox/streets-v12', // style URL
	center: [-74.5, 40], // starting position [lng, lat]
	zoom: 9, // starting zoom
});
