const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  deadline: { type: Date },
  status: { type: String, enum: ["Pending", "Completed"], default: "Pending" },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Attendee",
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
});

module.exports = mongoose.model("Task", TaskSchema);
