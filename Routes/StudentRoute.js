const express = require("express");
const router = express.Router();
const studentController = require("../Controllers/StudentController");
const verify=require("../Middleware/TokenVarification");
const permission=require("../Middleware/Permissions");

router.get("/",verify.auth,permission.permission(["admin"]), studentController.getStudents);

module.exports = router;