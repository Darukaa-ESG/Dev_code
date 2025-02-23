import express from "express";
import multer from "multer";
import pool from "../db/config";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get("/", async (req, res) => {
  try {
    console.log("Attempting to fetch projects from database...");
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    console.log("Query result:", result);
    if (!result.rows) {
      console.log("No rows returned from query");
      return res.json([]);
    }
    console.log(`Found ${result.rows.length} projects`);
    res.json(result.rows);
  } catch (error) {
    console.error("Database error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    res
      .status(500)
      .json({ error: "Failed to fetch projects", details: error.message });
  }
});

router.post("/", upload.single("siteFile"), async (req, res) => {
  try {
    const projectData = JSON.parse(req.body.projectData);
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
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

export default router;
