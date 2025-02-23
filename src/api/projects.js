import express from "express";
import multer from "multer";
import pool from "../db/config.js";
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

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

router.post("/", upload.fields([
  { name: 'siteFile', maxCount: 1 },
  { name: 'boundaryFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const projectData = JSON.parse(req.body.projectData);
    const siteData = JSON.parse(req.body.siteData || '{}');

    // Begin transaction
    await pool.query('BEGIN');

    // Insert project
    const projectResult = await pool.query(
      `INSERT INTO projects (
        name, project_identifier, project_start_date, project_end_date, 
        status, country, description, project_type, total_area, 
        emission_reduction_unit, total_emission_reduction, 
        avg_annual_emission_reduction, crediting_period, 
        project_developer, registry
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *`,
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

    // If site data is provided, insert site
    if (siteData.name) {
      const boundaryFilePath = req.files?.['boundaryFile']?.[0]?.path || null;
      
      await pool.query(
        `INSERT INTO sites (
          project_id, name, type, area, boundary, 
          cameras_installed, audio_devices
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          projectResult.rows[0].id,
          siteData.name,
          siteData.type,
          siteData.area,
          boundaryFilePath,
          siteData.cameras_installed || 0,
          siteData.audio_devices || 0
        ]
      );
    }

    await pool.query('COMMIT');
    res.status(201).json(projectResult.rows[0]);
  } catch (error) {
    await pool.query('ROLLBACK');
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to create project", details: error.message });
  }
});

export default router;
