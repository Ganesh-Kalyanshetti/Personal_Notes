// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// module.exports=(req,res,next)=>{

//     try{
//         const token = req.header('Authorization')?.split(' ')[1];

//         if(!token)
//         {
//             return res.status(401).json({message:"no token provided"});
//         }

//         const decoded = jwt.verify(token,process.env.ACCESS_TOKEN);
//         req.userId = decoded.id;

//         next();

//     }
//     catch(e)
//     {
//         res.status(401).json({message:"Invalid token"});
//     }
// }


const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // ✅ This gets the full token

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    req.userId = decoded.userId; // ✅ Match how you created the token

    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
