import express from "express";
import cors from "cors";
import pool from "./db/config";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;


// Middleware
app.use(cors());
app.use(express.json());

// API Routes
import projectsRouter from "./api/projects";
app.use("/api/projects", projectsRouter);

// Serve static files
app.use(express.static(path.join(__dirname, "../build")));

// Catch-all route for React app
app.get("*", (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});