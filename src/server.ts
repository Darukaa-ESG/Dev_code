
import express from "express";
import cors from "cors";
import path from "path";
import projectsRouter from "./api/projects";

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// API Routes - make sure these come BEFORE static files
app.use("/api/projects", projectsRouter);

app.get("/api/test", (req, res) => {
  console.log("Test endpoint hit");
  res.json({ message: "API is working" });
});

// For the React app, only serve static files for non-API routes
app.use((req, res, next) => {
  if (!req.path.startsWith('/api/')) {
    express.static(path.join(__dirname, "../build"))(req, res, next);
  } else {
    next();
  }
});

// Catch-all route for React app - only for non-API routes
app.get("*", (req, res) => {
  if (!req.path.startsWith('/api/')) {
    res.sendFile(path.join(__dirname, "../build", "index.html"));
  } else {
    res.status(404).json({ error: "API endpoint not found" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
