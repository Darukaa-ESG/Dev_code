import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Grid2,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardComponent } from "../../common/cardComponent";
import TableComponent from "../../common/tableComponent";
import { PROJECT_COLUMN } from "../../../constants/projectTable";
import { ProjectRowType } from "../../../Interface/Index";

const ProjectComponent = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectRowType[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [projectData, setProjectData] = useState({
    name: "",
    project_identifier: "",
    start_date: "",
    end_date: "",
    status: "",
    country: "",
    description: "",
    project_type: "",
    total_area: "",
    emission_reduction_unit: "",
    total_emission_reduction: "",
    avg_annual_emission_reduction: "",
    crediting_period: "",
    project_developer: "",
    registry: "",
  });
  const [siteFile, setSiteFile] = useState<File | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('https://03468663-6433-430b-8857-35337fcb58bc-00-3a34n9zkvcp0f.kirk.replit.dev:3001/api/projects');
      const data = await response.json();

      // Transform the data to match the table structure
      const transformedData = data.map((project: any) => ({
        name: project.name,
        status: project.status,
        start: new Date(project.start_date).toLocaleDateString(),
        end: new Date(project.end_date).toLocaleDateString(),
        type: project.project_type,
        country: project.country,
      }));

      setProjects(transformedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectData({
      ...projectData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSiteFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("projectData", JSON.stringify(projectData));
    if (siteFile) {
      formData.append("siteFile", siteFile);
    }

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setOpenDialog(false);
        setSnackbarOpen(true);
        fetchProjects(); // Refresh the projects list
      }
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create New Project
        </Button>
      </Box>

      <CardComponent title="Project Filter">
        {/* Filter content can be added here */}
      </CardComponent>

      <Box mt={3}>
        <TableComponent
          title="Recent Projects"
          rows={projects}
          columns={PROJECT_COLUMN}
          link="/project-details"
        />
      </Box>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Project</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ mt: 2 }}>
            <Grid2 container spacing={2}>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  name="name"
                  label="Project Name"
                  value={projectData.name}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  name="project_identifier"
                  label="Project Identifier"
                  value={projectData.project_identifier}
                  onChange={handleInputChange}
                />
              </Grid2>
              {/* Add other form fields as needed */}
            </Grid2>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message="Project created successfully"
      />
    </Box>
  );
};

export default ProjectComponent;