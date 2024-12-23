const mongoose = require("mongoose");

const AttendeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  assignedTasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

module.exports = mongoose.model("Attendee", AttendeeSchema);
