/* eslint-disable */
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { displayMaps } from './mapbox';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutButton = document.querySelector('.nav__el--logout');
const updateAccountForm = document.querySelector('.form-user-data');
const updatePasswordForm = document.querySelector('.form-user-settings');

// DELEGATIONS
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMaps(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', function (event) {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    event.preventDefault();
    login(email, password);
  });
}
if (updateAccountForm) {
  updateAccountForm.addEventListener('submit', function (event) {
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    event.preventDefault();
    updateSettings({ name, email }, 'data');
  });
}
if (updatePasswordForm) {
  updatePasswordForm.addEventListener('submit', async function (event) {
    document.querySelector('.btn--save-password').textContent = 'Updating...'
    event.preventDefault();
    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { password, passwordCurrent, passwordConfirm },
      'password',
      );
      document.getElementById('password-current').value = '';
      document.getElementById('password').value = '';
      document.getElementById('password-confirm').value = '';
      document.querySelector('.btn--save-password').textContent = 'Save password'
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', logout);
}
