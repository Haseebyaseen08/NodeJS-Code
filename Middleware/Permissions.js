const Users = require("../Models/User");

const permission =(roles) => {
  return async (req, res, next) => {
    const loginUser=await Users.findOne({Id:req.user.Id});
    const userRole=loginUser.Role;
    if(roles.includes(userRole)){
    next();
    }
    else{
        return res.status(401).send("Not Allowed.");
    }
  };
};

module.exports = { permission };
