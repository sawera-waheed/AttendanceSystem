const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decodedToken = jwt.verify(token, "SECRET_KEY");
      if (decodedToken) {
        req.userData = { userId: decodedToken.id };
        next();
      } else {
        throw new Error("Authentication failed");
      }
    } else {
      throw new Error("Unauthorized to access.");
    }
  } catch (err) {
    console.log(err);
    return next(err);
  }
};
