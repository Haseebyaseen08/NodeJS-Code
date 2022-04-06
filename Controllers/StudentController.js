const Users = require("../Models/User");

const getStudents = async (req, res) => {
  try {
    const students = await Users.find({ Role:'student'});
    return res.status(200).json(students);
  } catch (err) {
    return res.status(400).send({ message: err });
  }
};


module.exports={getStudents};
