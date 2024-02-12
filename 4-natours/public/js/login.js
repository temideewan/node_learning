/* eslint-disable */
const form = document.querySelector('.form');

const login = async (email, password) => {
  console.log(email, password);
  try {
    const res = await axios({
       method: 'POST',
       url: 'http://localhost:8000/api/v1/users/login',
       data: {
         email,
         password,
       },
     });
     console.log(res);
  } catch (error) {
    console.log(error.response.data);
  }
};
if (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}
