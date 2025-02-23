import express from "express";
import cors from "cors";
import multer from "multer";
import { Pool } from "pg";

const app = express();
const port = process.env.PORT || 3001;
const upload = multer({ dest: "uploads/" });

// Configure CORS
app.use(cors({
  origin: process.env.REPLIT_ENVIRONMENT === 'production' 
    ? process.env.REPLIT_URL 
    : 'https://03468663-6433-430b-8857-35337fcb58bc-00-3a34n9zkvcp0f.kirk.replit.dev',
  credentials: true
}));
app.use(express.json());

// Database connection
const pool = new Pool({
  user: "postgres",
  host: "0.0.0.0",
  database: "postgres", 
  password: "postgres",
  port: 5432
});

// Routes
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
    const siteFile = req.file;

    const result = await pool.query(
      "INSERT INTO projects (name, project_identifier, start_date, end_date, status, country, description, project_type, total_area, emission_reduction_unit, total_emission_reduction, avg_annual_emission_reduction, crediting_period, project_developer, registry) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *",
      [
        projectData.name,
        projectData.project_identifier,
        projectData.start_date,
        projectData.end_date,
        projectData.status,
        projectData.country,
        projectData.description,
        projectData.project_type,
        projectData.total_area,
        projectData.emission_reduction_unit,
        projectData.total_emission_reduction,
        projectData.avg_annual_emission_reduction,
        projectData.crediting_period,
        projectData.project_developer,
        projectData.registry,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});