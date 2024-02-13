/* eslint-disable */
import { login } from './login';
import { displayMaps } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.querySelector('.form');

// DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMaps(locations);
}

console.log(form);
if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log(email, password)
    console.log(email.value, password.value)
    login(email.value, password.value);
  });
}
