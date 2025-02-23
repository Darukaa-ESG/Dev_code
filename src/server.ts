import express from "express";
import cors from "cors";
import { Pool } from "pg";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;

// Configure PostgreSQL connection
const pool = new Pool({
  user: "postgres", 
  host: "0.0.0.0",
  database: "postgres",
  password: "postgres",
  port: 5432
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
import projectsRouter from "./api/projects";
app.use("/api/projects", projectsRouter);

// Serve static files AFTER API routes
app.use(express.static(path.join(__dirname, "../build")));

// Catch-all route AFTER API routes and static files
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});