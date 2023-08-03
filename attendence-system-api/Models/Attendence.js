const mongoose = require("mongoose");

const attendenceSchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  requestType: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

module.exports = mongoose.model("Attendence", attendenceSchema);
