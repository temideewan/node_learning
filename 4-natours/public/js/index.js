/* eslint-disable */
import { login } from './login';
import { displayMaps } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const email = document.getElementById('email').value;
const password = document.getElementById('password').value;
const form = document.querySelector('.form');

// DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMaps(locations);
}

console.log(form);
if (form) {
  form.addEventListener('submit', function (event) {
    console.log(email, password)
    event.preventDefault();
    login(email, password);
  });
}
