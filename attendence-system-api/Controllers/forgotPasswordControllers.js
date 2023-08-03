const User = require("../Models/Student");
const generateCode = require("../Utils/general_utils");
const EmailSender = require("../Utils/EmailSender");
const bcrypt = require("bcrypt");

exports.findAccount = async (req, res) => {
  const { email } = req.body;
  if (email) {
    try {
      const user = await User.findOne({ email });
      if (user) {
        const recovery_code = generateCode();
        user.passwordRecoveryCode = recovery_code;
        user
          .save()
          .then((user) => {
            EmailSender(
              user.email,
              "6-digit code to recover your account password.",
              `<p>Hi <b>${user.name}</b>,<br/> Here is your 6-digit code to recover your attendence system account password : <b>${recovery_code}</b></p>`,
              (resp) => {
                if (resp.success) {
                  return res.status(200).json({
                    message:
                      "User found and recovery code has been sent to the provided email.",
                    userId: user._id,
                  });
                } else {
                  return res.status(404).json({
                    message: "Email sending failed.",
                  });
                }
              }
            );
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        res.status(404).json({
          message: "User not found!",
        });
      }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(404).json({
      message: "Email was not provided.",
    });
  }
};

exports.verifyRecoveryCode = async (req, res) => {
  const recoveryCode = req.body.recoveryCode;
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (user && user.passwordRecoveryCode === Number(recoveryCode)) {
      user.passwordRecoveryCode = null;
      const updatedUser = await user.save();
      res.status(200).json({
        message: "Correct recovery code, you can change your password now.",
      });
    } else {
      res.status(404).json({
        message: "Invalid recovery code",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.changePassword = async (req, res) => {
  const password = req.body.password;
  console.log(password);
  const userId = req.body.userId;
  try {
    const user = await User.findById(userId);
    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      if (hashedPassword) {
        user.password = hashedPassword;
        const updatedUser = await user.save();
        if (updatedUser) {
          res.status(200).json({
            message: "Password changed successfully.",
          });
        } else {
          res.status(404).json({
            message: "Something went wrong while changing the password.",
          });
        }
      }
    } else {
      res.status(404).json({
        message: "Something went wrong while changing the password.",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
