// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) =>{
//     try {
//             const token = req.header.authorization.split(" ")[1];
//             jwt.verify(token, 'asd');
//             next();
//     }
//     catch(error) {
//         res.status(401).json({message: "Auth Failed"})
//     }
    
// }
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "asd");
    next();
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" });
  }
};
