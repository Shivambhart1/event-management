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

const allowedOrigins = ["https://eventhub-nine.vercel.app"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.options("*", cors()); // Handle preflight requests

app.use(bodyParser.json());
app.use((req, res, next) => {
  console.log("Origin:", req.headers.origin);
  console.log("Headers:", req.headers);
  next();
});


const db_uri = process.env.MONGODB_URI;
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
const server = http.createServer(app);
server.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));
