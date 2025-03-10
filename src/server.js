import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import projectsRouter from "./api/projects.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Define a route for the root path
app.get("/", (req, res) => {
  res.send("API is up and running!");
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

app.use((err, req, res, next) => {
  console.error("Global error handler caught:", err);
  res.status(500).json({ error: "Internal server error" });
});
