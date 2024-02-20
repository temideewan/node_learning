/* eslint-disable */
import { login, logout } from './login';
import { updateData } from './updateSettings';
import { displayMaps } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const email = document.getElementById('email');
const name = document.getElementById('name');
const password = document.getElementById('password');
const form = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const updateAccountForm = document.querySelector('.form-user-data');

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
if (updateAccountForm) {
  updateAccountForm.addEventListener('submit', function (event) {
    event.preventDefault();
    updateData(name.value, email.value);
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
