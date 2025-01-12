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

const server = http.createServer(app);

app.use(cors({
  origin: ["http://localhost:5173", "https://eventhub-nine.vercel.app"],
  credentials: true
}));
app.use(bodyParser.json());

const db_uri = process.env.MONGODB_URI;
// console.log(db_uri)
mongoose
  .connect(db_uri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection failed:", err));

app.use("/api/events", eventRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendees", attendeeRoutes);

app.get("/", (req, res) => {
  res.send("<h1>Hello from Backend</h1>");
});

const port = process.env.PORT || 3000;
server.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));
