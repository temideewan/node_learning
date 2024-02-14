/* eslint-disable */
import { login, logout } from './login';
import { displayMaps } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');

// DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMaps(locations);
}

if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    login(email.value, password.value);
  });
}

if(logoutButton){
  logoutButton.addEventListener('click', logout);
}
