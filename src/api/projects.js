import express from "express";
import multer from "multer";
import pool from "../db/config.js";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../uploads/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

router.post("/", upload.array("boundaryFiles"), async (req, res) => {
  try {
    if (!req.body.projectData || !req.body.sitesData) {
      return res.status(400).json({ error: "Missing required data" });
    }
    const projectData = JSON.parse(req.body.projectData);
    const sitesData = JSON.parse(req.body.sitesData);
    const files = req.files || [];

    await pool.query("BEGIN");

    // Insert project
    const projectResult = await pool.query(
      `INSERT INTO projects (
        name, project_start_date, project_end_date, status, 
        country, description, project_type, number_of_sites
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        projectData.name,
        projectData.start_date,
        projectData.end_date,
        projectData.status,
        projectData.country,
        projectData.description,
        projectData.project_type,
        projectData.number_of_sites,
      ],
    );

    const projectId = projectResult.rows[0].id;

    // Insert sites
    for (let i = 0; i < sitesData.length; i++) {
      const site = sitesData[i];
      const boundaryFile = files[i];

      await pool.query(
        `INSERT INTO sites (
          project_id, name, type, boundary
        ) VALUES ($1, $2, $3, $4)`,
        [
          projectId,
          site.name,
          site.type,
          boundaryFile ? boundaryFile.path : null,
        ],
      );
    }

    await pool.query("COMMIT");
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

export default router;
