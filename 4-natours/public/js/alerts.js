// type 'success' or 'error'
export const showAlert = (type, msg) => {
  hideAlert();
  const markup = document.createElement('div');
  markup.setAttribute('class',`alert alert--${type}`)
  markup.textContent = msg;
  document.querySelector('body').insertAdjacentElement('afterbegin', markup)

  window.setTimeout(hideAlert, 5000)
}

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if(el){
    el.parentElement.removeChild(el);
  }
}
