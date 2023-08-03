const express = require("express");
const check_auth = require("../Middlewares/check_auth");

const controllers = require("../Controllers/controllers");

const router = express.Router();

router.post("/register", controllers.register);
router.post("/login", controllers.login);
router.use(check_auth);
router.post("/attendence", controllers.attendence);
router.get("/getStudentRequests", controllers.getStudentRequests);
router.get("/getAdminRequests", controllers.getAdminRequests);
router.post("/acceptRequest/:id", controllers.acceptRequest);
router.post("/rejectRequest/:id", controllers.rejectRequest);

module.exports = router;
