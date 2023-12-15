// eslint-disable-next-line arrow-body-style
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

// the function wraps our controller handlers, because the handlers are async functions and essentially promises
// they get rejected with an error when there's an issue and that error is then caught in this function.
// calling next with that error will trigger our global error handler
