require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");

const eventRoutes = require("./routes/events");
const taskRoutes = require("./routes/tasks");
const attendeeRoutes = require("./routes/attendees");

const app = express();
app.use(cors({
  origin: ['http://localhost:5173', process.env.FRONTEND_URL],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection failed:", err));

app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendees", attendeeRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello from Backend</h1>");
});

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
