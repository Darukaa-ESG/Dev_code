import express from "express";
import cors from "cors";
import multer from "multer";
import { Pool } from "pg";
import path from "path";

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ dest: "uploads/" });

// Define your pool instance
const pool = new Pool({
  user: "postgres",
  host: "0.0.0.0",
  database: "postgres",
  password: "postgres",
  port: 5432,
});

app.use(cors());
app.use(express.json());

// API Routes should be defined before static file serving:
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/projects", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/projects", upload.single("siteFile"), async (req, res) => {
  try {
    const projectData = JSON.parse(req.body.projectData);
    // Insert project logic here...
    res.status(201).json({
      /* new project */
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Serve static files from the build folder
app.use(express.static(path.join(__dirname, "build")));

// Catch-all to serve index.html for any unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
