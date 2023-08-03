const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Student = require("../Models/Student");
const Attendence = require("../Models/Attendence");
const EmailSender = require("../Utils/EmailSender");

exports.register = (req, res, next) => {
  const { name, email, password, isAdmin } = req.body;
  console.log(req.body);
  Student.findOne({ email: email })
    .then((user) => {
      if (!user) {
        bcrypt.hash(password, 10).then((hashedPassword) => {
          const student = new Student({
            name: name,
            email: email,
            password: hashedPassword,
            isAdmin: false,
            passwordRecoveryCode: null,
          });
          student
            .save()
            .then((student) => {
              EmailSender(
                student.email,
                "Account successfully registered.",
                `<p>Hi ${student.name},</p><br><p>Your account for attendence system has been created successfully.<p>`,
                (resp) => {
                  if (resp.success) {
                    return res.json({
                      data: student,
                      message: "Account created successfully.",
                    });
                  } else {
                    return res.json({
                      message: "Email sending failed.",
                    });
                  }
                }
              );
            })
            .catch((err) => {
              console.log(err);
            });
        });
      } else {
        return res.json({
          message: "Account with this email is already registered.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  Student.findOne({ email: email })
    .then((student) => {
      if (student) {
        bcrypt.compare(password, student.password).then((matched) => {
          if (matched) {
            token = jwt.sign(
              { id: student._id, email: student.email },
              "SECRET_KEY"
            );
            return res.status(200).json({
              message: "You are logged in.",
              student: { name: student.name, isAdmin: student.isAdmin },
              token: token,
            });
          } else {
            return res.status(401).json({
              message: "Password is incorrect.",
            });
          }
        });
      } else {
        return res.json({
          message: "There is no account associated with this email.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.attendence = async (req, res, next) => {
  let state = req.body;
  const updatedState = {
    ...state,
    requestType: req.query.requestType,
    createdBy: req.userData.userId,
  };
  try {
    const student = await Student.findById(updatedState.createdBy).populate(
      "requests"
    );
    if (student) {
      const request = new Attendence(updatedState);
      const savedRequest = await request.save();
      student.requests.push(savedRequest);
      await student.save();
      const admin = await Student.findOne({ isAdmin: true });
      if (admin) {
        admin.requests.push(savedRequest);
        await admin.save();
        res.json({
          message: "Request submitted successfully",
          student: student,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getStudentRequests = (req, res, next) => {
  const studentId = req.userData.userId;
  Student.findById(studentId)
    .populate("requests")
    .then((student) => {
      if (student) {
        res.json({ student: student });
      }
    });
};

exports.getAdminRequests = (req, res, next) => {
  const adminId = req.userData.userId;
  Student.findById(adminId)
    .populate({
      path: "requests",
      populate: {
        path: "createdBy",
      },
    })
    .then((admin) => {
      if (admin) {
        res.json({ admin: admin });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.acceptRequest = (req, res, next) => {
  const requestId = req.params.id;
  Attendence.findById(requestId)
    .then((request) => {
      if (request) {
        request.status = "Accepted";
        request
          .save()
          .then(() => {
            Student.findOne({ isAdmin: true })
              .populate({
                path: "requests",
                populate: {
                  path: "createdBy",
                },
              })
              .then((admin) => {
                if (admin) {
                  const filteredRequests = admin.requests.filter(
                    (element) => element._id != requestId
                  );
                  admin.requests = filteredRequests;
                  admin.save().then((updatedAdmin) => {
                    return res.json({
                      admin: updatedAdmin,
                    });
                  });
                }
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.rejectRequest = (req, res, next) => {
  const requestId = req.params.id;
  console.log(req.userData);
  Attendence.findById(requestId)
    .then((request) => {
      if (request) {
        request.status = "Rejected";
        request
          .save()
          .then(() => {
            Student.findOne({ isAdmin: true })
              .populate({
                path: "requests",
                populate: {
                  path: "createdBy",
                },
              })
              .then((admin) => {
                if (admin) {
                  const filteredRequests = admin.requests.filter(
                    (element) => element._id != requestId
                  );
                  admin.requests = filteredRequests;
                  admin.save().then((updatedAdmin) => {
                    Student.findById(request.createdBy).then((student) => {
                      if (student) {
                        const filteredRequests = student.requests.filter(
                          (element) => element._id != requestId
                        );
                        student.requests = filteredRequests;
                        student.save().then((updatedStudent) => {
                          res.json({
                            message: "request rejected successfully.",
                            admin: updatedAdmin,
                          });
                        });
                      }
                    });
                  });
                }
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
