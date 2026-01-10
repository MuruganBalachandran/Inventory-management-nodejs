// region logger function
const func =  (req, res, next) => {
  const start = Date.now()

  res.on('finish', () => {
    try {
      const duration = Date.now() - start

      console.log(
        `[${new Date().toISOString()}]`,
        req?.method,
        req?.originalUrl,
        res?.statusCode,
        `${duration}ms`
      )
    } catch (err) {
      // Never crash app because of logger
      console.error('Logger error:', err)
    }
  })

  next()
}
// endregion

// region exports
module.exports = func;
// endregion