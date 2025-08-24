const jwt = require("jsonwebtoken");

const generateToken = (id:any, role:any) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d"
  });
};

module.exports = { generateToken };
