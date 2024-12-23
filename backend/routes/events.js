const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const Task = require("../models/Task"); // Assuming you have a Task model

const sendErrorRes = (res, statusCode, message) => {
  res.status(statusCode).json({ error: message });
};

// POST for new events
router.post("/", async (req, res) => {
  try {
    const { name, description, location, date } = req.body;

    if (!name || !date) {
      return sendErrorRes(res, 400, "Name and date are required");
    }

    const existingEvent = await Event.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      date,
    });
    if (existingEvent) {
      return sendErrorRes(res, 400, "Event already exists");
    }

    const event = new Event({ name, description, location, date });
    await event.save();

    res.status(201).send("Event created");
  } catch (error) {
    sendErrorRes(res, 500, "Error creating event: " + error.message);
  }
});

// GET all events with populated tasks
router.get("/", async (req, res) => {
  try {
    const events = await Event.find().populate("tasks");
    if (events.length === 0) {
      return sendErrorRes(res, 404, "No events found");
    }
    res.status(200).json(events);
  } catch (error) {
    sendErrorRes(res, 500, "Error getting events: " + error.message);
  }
});

// GET tasks by eventId
router.get("/tasks", async (req, res) => {
  try {
    const { eventId } = req.query;

    if (!eventId) {
      return sendErrorRes(res, 400, "Event ID is required");
    }

    // Find event by ID and populate tasks
    const event = await Event.findById(eventId).populate("tasks");
    if (!event) {
      return sendErrorRes(res, 404, "Event not found");
    }

    // Return tasks associated with the selected event
    res.status(200).json(event.tasks);
  } catch (error) {
    sendErrorRes(res, 500, "Error fetching tasks: " + error.message);
  }
});

// PUT for updating an event
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, location, date } = req.body;

    if (!name || !date) {
      return sendErrorRes(res, 400, "Name and date are required");
    }

    const event = await Event.findById(id);
    if (!event) {
      return sendErrorRes(res, 404, "Event not found");
    }

    event.name = name;
    event.description = description;
    event.location = location;
    event.date = date;
    await event.save();

    res.status(200).send("Event updated");
  } catch (error) {
    sendErrorRes(res, 500, "Error updating event: " + error.message);
  }
});

// DELETE an event
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      return sendErrorRes(res, 404, "Event not found");
    }

    res.status(200).send("Event deleted");
  } catch (error) {
    sendErrorRes(res, 500, "Error deleting event: " + error.message);
  }
});

module.exports = router;
