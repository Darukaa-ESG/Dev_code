const express = require("express");
const cors = require("cors");
const path = require("path");
const projectsRouter = require("./api/projects");

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/projects", projectsRouter);

app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({ message: "API is working" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
