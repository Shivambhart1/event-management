const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const eventRoutes = require("./routes/events");
const taskRoutes = require("./routes/tasks");
const attendeeRoutes = require("./routes/attendees");

dotenv.config();
const app = express();

const server = http.createServer(app);

app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/event_management")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection failed:", err));

app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendees", attendeeRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello from Backend</h1>");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
