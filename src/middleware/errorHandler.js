// region error handler
const errorHandler = (err, req, res, next) => {
  console.error(err);

  const status = err?.statusCode || err?.status || 500;
  const message = err?.message || "Internal Server Error";

  res?.status(status).send({ message });
};
// endregion

// region exports
module.exports = errorHandler;
// endregion
