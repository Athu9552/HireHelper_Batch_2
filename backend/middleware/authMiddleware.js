const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({
      message: "Access Denied. No token provided"
    });
  }

  // Remove "Bearer " if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  try {

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();

  } catch (err) {

    res.status(400).json({
      message: "Invalid Token"
    });

  }

};
