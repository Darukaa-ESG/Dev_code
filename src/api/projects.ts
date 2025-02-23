
import express from 'express';
import multer from 'multer';
import { db } from '../db/models';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.getProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/api/projects', upload.single('siteFile'), async (req, res) => {
  try {
    const projectData = JSON.parse(req.body.projectData);
    const siteFile = req.file;
    
    // Create project in database
    const project = await db.createProject(projectData);
    
    if (siteFile) {
      // Process and store site boundary
      await db.createSite({
        project_id: project.id,
        boundary: siteFile.path,
        ...projectData
      });
    }
    
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create project' });
  }
});

export default router;
import express from 'express';
import { Pool } from 'pg';

const router = express.Router();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'postgres',
  port: 5432,
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM projects');
    res.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { projectData } = req.body;
    const data = JSON.parse(projectData);
    
    const result = await pool.query(
      'INSERT INTO projects (name, project_identifier, start_date, end_date, status, country, description, project_type, total_area, emission_reduction_unit, total_emission_reduction, avg_annual_emission_reduction, crediting_period, project_developer, registry) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING *',
      [data.name, data.project_identifier, data.start_date, data.end_date, data.status, data.country, data.description, data.project_type, data.total_area, data.emission_reduction_unit, data.total_emission_reduction, data.avg_annual_emission_reduction, data.crediting_period, data.project_developer, data.registry]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
