// the reason we need to return a function is because we need to call the function with the arguments so that we can pass the arguments to the function that we want to wrap in the try catch block
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};
