// region middleware
const admin = (req, res, next) => {
  try {
    if (req?.user?.role !== "admin") {
      return res.status(403).send({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(403).send({ message: "Admin access required" });
  }
};
// endregion

// region exports
module.exports = admin;
// endregion
