<<<<<<< HEAD
// region imports
const STATUS_CODE = require("../constants/statusCodes");
const sendResponse = require("../utils/sendResponse");
// endregion

=======
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
// region middleware
const admin = (req, res, next) => {
  try {
    if (req?.user?.role !== "admin") {
<<<<<<< HEAD
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        "error",
        "Admin access required",
        null,
        "Admin middleware"
      );
    }
    next();
  } catch (err) {
    return sendResponse(
      res,
      err?.statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR,
      "error",
      err?.message || "Something went wrong",
              null,
        "Admin middleware"
    );
=======
      return res.status(403).send({ message: "Admin access required" });
    }
    next();
  } catch (err) {
    res.status(403).send({ message: "Admin access required" });
>>>>>>> 444f163a5ca72f883d3a71eaa4076d959c28b34b
  }
};
// endregion

// region exports
module.exports = admin;
// endregion
