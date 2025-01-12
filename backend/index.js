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

app.use(cors({
  origin: ["http://localhost:5173", "eventhub-nine.vercel.app"],
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

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
