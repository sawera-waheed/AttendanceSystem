const mongoose = require("mongoose");

const studentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  requests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Attendence",
    },
  ],
  passwordRecoveryCode: {
    type: Number,
  },
});

module.exports = mongoose.model("Student", studentSchema);
