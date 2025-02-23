
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
