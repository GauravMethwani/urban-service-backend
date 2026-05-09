import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  let token = req.headers["authorization"]?.split(" ")[1] || req.headers["x-access-token"] || req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .send({ success: false, message: "No token provided!" });
  }

  jwt.verify(token, process.env.hashKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ success: false, message: "Unauthorized!" });
    }
    req.user = decoded;
    next();
  });
};

const isVendor = (req, res, next) => {
  if (req.user && (req.user.role === "vendor" || req.user.type === "vendor")) {
    next();
  } else {
    return res.status(403).send({ success: false, message: "Require Vendor Role!" });
  }
};

const isCustomer = (req, res, next) => {
  if (req.user && (req.user.role === "customer" || req.user.type === "customer")) {
    next();
  } else {
    return res.status(403).send({ success: false, message: "Require Customer Role!" });
  }
};

const authJwt = {
  verifyToken,
  isVendor,
  isCustomer
};

export default authJwt;
