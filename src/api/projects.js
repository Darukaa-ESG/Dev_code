import express from "express";
import multer from "multer";
import pool from "../db/config.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import shp from "shpjs";
import { createReadStream } from "fs";
import unzipper from "unzipper";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug: log the type of shp to verify it's a function.
console.log("Type of shp:", typeof shp);

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

// Deep coordinate flattening function for nested arrays
const deepFlattenCoordinates = (arr) => {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val)) {
      if (typeof val[0] === "number") {
        return [...acc, val.slice(0, 2)];
      }
      return [...acc, deepFlattenCoordinates(val)];
    }
    return acc;
  }, []);
};

router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({
      error: "Failed to fetch projects",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

router.post("/", upload.array("boundaryFiles"), async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Uploaded files:", req.files);
  try {
    if (!req.body.projectData || !req.body.sitesData) {
      return res
        .status(400)
        .json({ error: "Missing required data in request body" });
    }
    const projectData = JSON.parse(req.body.projectData);
    const sitesData = JSON.parse(req.body.sitesData);
    const files = req.files || [];
    await pool.query("BEGIN");
    // Insert project
    const projectResult = await pool.query(
      `INSERT INTO projects (
        name, project_start_date, project_end_date, status, 
        country, description, project_type, number_of_sites, registry
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        projectData.name,
        projectData.start_date,
        projectData.end_date,
        projectData.status,
        projectData.country,
        projectData.description,
        projectData.project_type,
        projectData.number_of_sites,
        projectData.registry || "",
      ],
    );
    const projectId = projectResult.rows[0].id;
    for (let i = 0; i < sitesData.length; i++) {
      const site = sitesData[i];
      const boundaryFile = files[i];
      let boundaryGeom = null;
      if (boundaryFile) {
        try {
          const fileExt = path.extname(boundaryFile.path).toLowerCase();

          if (fileExt === ".geojson" || fileExt === ".json") {
            const fileContent = await fs.readFile(boundaryFile.path, "utf8");
            let geojson;
            try {
              geojson = JSON.parse(fileContent);
            } catch (jsonErr) {
              throw new Error(`Invalid GeoJSON file: ${jsonErr.message}`);
            }
            if (
              geojson.type === "FeatureCollection" &&
              geojson.features?.length > 0
            ) {
              geojson = geojson.features[0].geometry;
            } else if (geojson.type === "Feature") {
              geojson = geojson.geometry;
            }
            if (!["Polygon", "MultiPolygon"].includes(geojson.type)) {
              throw new Error(
                `Unsupported geometry type: ${geojson.type}. Only Polygon and MultiPolygon are allowed.`,
              );
            }
            geojson.coordinates = deepFlattenCoordinates(geojson.coordinates);
            boundaryGeom = JSON.stringify(geojson);
          } else if (fileExt === ".zip") {
            try {
              // Read the entire zip file as a buffer.
              const zipBuffer = await fs.readFile(boundaryFile.path);
              // Ensure shp is a function before calling it.
              if (typeof shp !== "function") {
                throw new Error(
                  "shp is not a function. Check your shpjs version.",
                );
              }
              let geojson = await shp(zipBuffer);
              // If the result is a FeatureCollection, extract the first feature's geometry.
              if (geojson.features && geojson.features.length > 0) {
                geojson = geojson.features[0].geometry;
              }
              if (!["Polygon", "MultiPolygon"].includes(geojson.type)) {
                throw new Error(
                  `Unsupported geometry type: ${geojson.type}. Only Polygon and MultiPolygon are allowed.`,
                );
              }
              geojson.coordinates = deepFlattenCoordinates(geojson.coordinates);
              boundaryGeom = JSON.stringify(geojson);
            } catch (zipErr) {
              throw new Error(`Error processing shapefile: ${zipErr.message}`);
            }
          } else {
            throw new Error(
              `Unsupported file format: ${fileExt}. Please upload a GeoJSON file or a zipped shapefile.`,
            );
          }

          console.log(`Processed boundary for site ${i + 1}`);
        } catch (err) {
          console.error(
            `Error processing boundary file for site ${i + 1}:`,
            err,
          );
          throw err;
        }
      }
      try {
        await pool.query(
          `INSERT INTO sites (
            project_id, name, type, boundary
          ) VALUES ($1, $2, $3, 
            ST_Force2D(
              ST_SetSRID(ST_GeomFromGeoJSON($4), 4326)
            )
          )`,
          [projectId, site.name, site.type, boundaryGeom || null],
        );
      } catch (err) {
        console.error(`Error inserting site ${i + 1}:`, err);
        throw err;
      }
    }
    await pool.query("COMMIT");
    res.status(201).json({ message: "Project created successfully" });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Project creation failed:", error);
    res.status(500).json({
      error: "Project creation failed",
      details: error instanceof Error ? error.message : "Unknown error",
      ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
  } finally {
    if (req.files?.length) {
      await Promise.all(
        req.files.map((file) =>
          fs
            .unlink(file.path)
            .catch((err) =>
              console.error(`Error deleting file ${file.path}:`, err),
            ),
        ),
      );
    }
  }
});

export default router;
