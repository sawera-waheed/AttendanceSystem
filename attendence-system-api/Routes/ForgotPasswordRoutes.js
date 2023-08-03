const express = require("express");
const check_auth = require("../Middlewares/check_auth");

const forgotPasswordControllers = require("../Controllers/forgotPasswordControllers");

const router = express.Router();

router.post("/find-account", forgotPasswordControllers.findAccount);
router.post("/recovery-code", forgotPasswordControllers.verifyRecoveryCode);
router.post("/change-password", forgotPasswordControllers.changePassword);

module.exports = router;
