import express from "express";
import multer from "multer";
import pool from "../db/config.js";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";
import shp from "shpjs";
import JSZip from "jszip";
import { createReadStream } from "fs";
import unzipper from "unzipper";

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

    // Process and insert sites
    for (let i = 0; i < sitesData.length; i++) {
      const site = sitesData[i];
      const boundaryFile = files[i];
      let boundaryGeom = null;

      if (boundaryFile) {
        try {
          // Get file extension to determine processing method
          const fileExt = path.extname(boundaryFile.path).toLowerCase();
          
          if (fileExt === '.geojson' || fileExt === '.json') {
            // Process GeoJSON file
            const fileContent = await fs.readFile(boundaryFile.path, "utf8");
            let geojson;

            try {
              geojson = JSON.parse(fileContent);
            } catch (jsonErr) {
              throw new Error(`Invalid GeoJSON file: ${jsonErr.message}`);
            }

            // Extract geometry from GeoJSON structure
            if (
              geojson.type === "FeatureCollection" &&
              geojson.features?.length > 0
            ) {
              geojson = geojson.features[0].geometry;
            } else if (geojson.type === "Feature") {
              geojson = geojson.geometry;
            }

            // Validate geometry type
            if (!["Polygon", "MultiPolygon"].includes(geojson.type)) {
              throw new Error(
                `Unsupported geometry type: ${geojson.type}. Only Polygon and MultiPolygon are allowed.`,
              );
            }

            // Process coordinates to remove Z values
            geojson.coordinates = deepFlattenCoordinates(geojson.coordinates);
            boundaryGeom = JSON.stringify(geojson);
          } else if (fileExt === '.zip') {
            // Process shapefile in zip format
            const extractDir = path.join(__dirname, `../../uploads/extract-${Date.now()}`);
            await fs.mkdir(extractDir, { recursive: true });
            
            try {
              // Extract zip file contents
              await createReadStream(boundaryFile.path)
                .pipe(unzipper.Extract({ path: extractDir }))
                .promise();
              
              // Find the .shp file in the extracted directory
              const files = await fs.readdir(extractDir);
              const shpFile = files.find(file => file.endsWith('.shp'));
              
              if (!shpFile) {
                throw new Error('No .shp file found in the zip archive');
              }
              
              // Convert shapefile to GeoJSON
              const shpFilePath = path.join(extractDir, shpFile);
              const shpBuffer = await fs.readFile(shpFilePath);
              const geojsonData = await shp.parseShp(shpBuffer);
              
              // Get the DBF data if available
              const dbfFile = files.find(file => file.endsWith('.dbf'));
              let dbfData = null;
              if (dbfFile) {
                const dbfBuffer = await fs.readFile(path.join(extractDir, dbfFile));
                dbfData = await shp.parseDbf(dbfBuffer);
              }
              
              // Combine the shapefile and DBF data
              let geojson;
              if (dbfData) {
                geojson = shp.combine([geojsonData, dbfData]);
              } else {
                geojson = {
                  type: "FeatureCollection",
                  features: geojsonData.map(g => ({ type: "Feature", properties: {}, geometry: g }))
                };
              }
              
              // Extract first feature's geometry
              if (geojson.features?.length > 0) {
                geojson = geojson.features[0].geometry;
              }
              
              // Validate geometry type
              if (!["Polygon", "MultiPolygon"].includes(geojson.type)) {
                throw new Error(
                  `Unsupported geometry type: ${geojson.type}. Only Polygon and MultiPolygon are allowed.`,
                );
              }
              
              // Process coordinates to remove Z values
              geojson.coordinates = deepFlattenCoordinates(geojson.coordinates);
              boundaryGeom = JSON.stringify(geojson);
              
              // Clean up the extracted files
              await fs.rm(extractDir, { recursive: true, force: true });
            } catch (zipErr) {
              // Clean up extraction directory if it exists
              try {
                await fs.rm(extractDir, { recursive: true, force: true });
              } catch (cleanupErr) {
                console.error('Error cleaning up extracted files:', cleanupErr);
              }
              
              throw new Error(`Error processing shapefile: ${zipErr.message}`);
            }
          } else {
            throw new Error(
              `Unsupported file format: ${fileExt}. Please upload a GeoJSON file or a zipped shapefile.`
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
    // Cleanup uploaded files
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
