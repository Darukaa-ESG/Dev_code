import express from "express";
import cors from "cors";
import pool from "./db/config";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes
import projectsRouter from "./api/projects";

// Handle API routes first
app.use("/api/projects", projectsRouter);

// Test endpoint
app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({ message: "API is working" });
});

// Serve static files
app.use(express.static(path.join(__dirname, "../build")));

// Catch-all route for React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
