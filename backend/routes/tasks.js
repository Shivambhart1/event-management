const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const Event = require("../models/Event");
const Attendee = require("../models/Attendee");

router.post("/", async (req, res) => {
  try {
    const { name, deadline, status, assignedTo, eventId } = req.body;

    if (!name || !assignedTo || !eventId) {
      return res
        .status(400)
        .json({ message: "Name, assignedTo, and eventId are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const task = new Task({ name, deadline, status, assignedTo, eventId });
    await task.save();

    const attendee = await Attendee.findById(assignedTo);
    if (!attendee) {
      return res.status(404).json({ message: "Attendee not found" });
    }
    attendee.assignedTasks.push(task._id);
    await attendee.save();

    res.status(201).json(task);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating task", error: error.message });
  }
});

// router.get("/attendee/:attendeeId", async (req, res) => {
//   try {
//     const attendeeId = req.params.attendeeId;

//     const attendee = await Attendee.findById(attendeeId);
//     if (!attendee) {
//       return res.status(404).json({ message: "Attendee not found" });
//     }

//     const tasks = await Task.find({
//       _id: { $in: attendee.assignedTasks },
//     }).populate("assignedTo", "name email");

//     if (!tasks || tasks.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No tasks found for this attendee" });
//     }

//     res.status(200).json(tasks);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error fetching tasks", error: error.message });
//   }
// });

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email") // Populating assignedTo field with name and email
      .populate("eventId", "name"); // Populating eventId field with name

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, deadline, status, assignedTo, eventId } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (eventId && eventId !== task.eventId.toString()) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      task.eventId = eventId;
    }

    const oldAttendee = await Attendee.findById(task.assignedTo);
    const newAttendee = await Attendee.findById(assignedTo);

    if (oldAttendee && oldAttendee._id.toString() !== assignedTo) {
      oldAttendee.assignedTasks.pull(task._id);
      await oldAttendee.save();
    }

    if (newAttendee) {
      newAttendee.assignedTasks.push(task._id);
      await newAttendee.save();
    }

    task.name = name;
    task.deadline = deadline;
    task.status = status;
    task.assignedTo = assignedTo;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
});

module.exports = router;
