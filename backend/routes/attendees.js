const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");
const Task = require("../models/Task");
const io = require("../index");

// Create a new attendee
router.post("/", async (req, res) => {
  try {
    const { name, email, assignedTasks } = req.body;

    // Validate input
    if (!name || !email) {
      return res.status(400).send("Name and email are required");
    }

    // Ensure assigned tasks are valid ObjectIds
    if (assignedTasks && !Array.isArray(assignedTasks)) {
      return res.status(400).send("assignedTasks must be an array of Task IDs");
    }

    const attendee = new Attendee({ name, email, assignedTasks });

    await attendee.save();

    res.status(201).json({ message: "Attendee created", attendee });
  } catch (error) {
    res.status(500).send("Error creating attendee: " + error.message);
  }
});

// Get all attendees
router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find().populate(
      "assignedTasks",
      "name deadline status"
    );
    res.status(200).json(attendees);
  } catch (error) {
    res.status(500).send("Error fetching attendees: " + error.message);
  }
});

// Update assigned tasks for an attendee
router.put("/:id/tasks", async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTasks } = req.body;

    // Validate assignedTasks
    if (!Array.isArray(assignedTasks)) {
      return res.status(400).send("assignedTasks must be an array");
    }

    // Find attendee
    const attendee = await Attendee.findById(id);
    if (!attendee) {
      return res.status(404).send("Attendee not found");
    }

    // Update assignedTasks and save
    attendee.assignedTasks = assignedTasks;
    await attendee.save();

    res.status(200).json({ message: "Assigned tasks updated", attendee });
  } catch (error) {
    res.status(500).send("Error updating assigned tasks: " + error.message);
  }
});

// Delete an attendee
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Delete attendee
    const attendee = await Attendee.findByIdAndDelete(id);
    if (!attendee) {
      return res.status(404).send("Attendee not found");
    }

    res.status(200).send("Attendee deleted");
  } catch (error) {
    res.status(500).send("Error deleting attendee: " + error.message);
  }
});

module.exports = router;
