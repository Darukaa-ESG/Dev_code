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
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardComponent } from "../../common/cardComponent";
import TableComponent from "../../common/tableComponent";
import { PROJECT_COLUMN } from "../../../constants/projectTable";
import { ProjectRowType } from "../../../Interface/Index";

const ProjectComponent = () => {
  const navigate = useNavigate();
  // Store the complete API data and the filtered display data separately.
  const [allProjects, setAllProjects] = useState<any[]>([]);
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

  // Filter state – these are the currently selected filter values.
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedRegistry, setSelectedRegistry] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // These states hold the available options derived from API data.
  const [filterOptions, setFilterOptions] = useState({
    projects: [] as string[],
    registries: [] as string[],
    countries: [] as string[],
    types: [] as string[],
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // Replace the URL with your API endpoint as needed.
      const response = await fetch(
        "https://03468663-6433-430b-8857-35337fcb58bc-00-3a34n9zkvcp0f.kirk.replit.dev:3001/api/projects",
      );
      const data = await response.json();
      setAllProjects(data);

      // Derive filter options from API response.
      const projectNames = Array.from(
        new Set(data.map((p: any) => p.name)),
      ) as string[];
      const registryNames = Array.from(
        new Set(data.map((p: any) => p.registry)),
      ).sort();
      const countryNames = Array.from(
        new Set(data.map((p: any) => p.country)),
      ).sort();
      const typeNames = Array.from(
        new Set(data.map((p: any) => p.project_type)),
      ).sort();

      setFilterOptions({
        projects: projectNames,
        registries: registryNames,
        countries: countryNames,
        types: typeNames,
      });

      // Transform the API data for display in the table.
      const transformedData = data.map((project: any) => ({
        id: project.id!, // using non-null assertion if you're sure it exists
        name: project.name,
        status: project.status,
        start: project.project_start_date
          ? new Date(project.project_start_date).toLocaleDateString()
          : "N/A",
        end: project.project_end_date
          ? new Date(project.project_end_date).toLocaleDateString()
          : "N/A",
        type: project.project_type,
        country: project.country,
      }));

      setProjects(transformedData);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Handlers for form input changes in the Create Project dialog.
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

  // Handle filter dropdown changes.
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "project") setSelectedProject(value);
    else if (name === "registry") setSelectedRegistry(value);
    else if (name === "country") setSelectedCountry(value);
    else if (name === "type") setSelectedType(value);
  };

  // Apply the filter options by filtering the full project list.
  const applyFilters = () => {
    const filtered = allProjects.filter((project) => {
      return (
        (!selectedProject || project.name === selectedProject) &&
        (!selectedRegistry || project.registry === selectedRegistry) &&
        (!selectedCountry || project.country === selectedCountry) &&
        (!selectedType || project.project_type === selectedType)
      );
    });

    const transformedData = filtered.map((project: any) => ({
      id: project.id, // include id for table row keys
      name: project.name,
      status: project.status,
      start: project.project_start_date
        ? new Date(project.project_start_date).toLocaleDateString()
        : "N/A",
      end: project.project_end_date
        ? new Date(project.project_end_date).toLocaleDateString()
        : "N/A",
      type: project.project_type,
      country: project.country,
    }));

    setProjects(transformedData);
  };

  // Reset filters and show all projects.
  const resetFilters = () => {
    setSelectedProject("");
    setSelectedRegistry("");
    setSelectedCountry("");
    setSelectedType("");

    const transformedData = allProjects.map((project: any) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      start: project.project_start_date
        ? new Date(project.project_start_date).toLocaleDateString()
        : "N/A",
      end: project.project_end_date
        ? new Date(project.project_end_date).toLocaleDateString()
        : "N/A",
      type: project.project_type,
      country: project.country,
    }));
    setProjects(transformedData);
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
        fetchProjects(); // Refresh the projects list (and filter options) after adding a new project.
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
        <Box sx={{ p: 2 }}>
          <Grid2 container spacing={2}>
            <Grid2 component="div" xs={12} md={3}>
              <TextField
                select
                fullWidth
                name="project"
                label="Project"
                variant="outlined"
                size="small"
                value={selectedProject}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.projects.map((proj) => (
                  <MenuItem key={proj} value={proj}>
                    {proj}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 component="div" xs={12} md={3}>
              <TextField
                select
                fullWidth
                name="registry"
                label="Registry Name"
                variant="outlined"
                size="small"
                value={selectedRegistry}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.registries.map((reg) => (
                  <MenuItem key={reg} value={reg}>
                    {reg}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 component="div" xs={12} md={3}>
              <TextField
                select
                fullWidth
                name="country"
                label="Country"
                variant="outlined"
                size="small"
                value={selectedCountry}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.countries.map((ctry) => (
                  <MenuItem key={ctry} value={ctry}>
                    {ctry}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
            <Grid2 component="div" xs={12} md={3}>
              <TextField
                select
                fullWidth
                name="type"
                label="Project Type"
                variant="outlined"
                size="small"
                value={selectedType}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                {filterOptions.types.map((typ) => (
                  <MenuItem key={typ} value={typ}>
                    {typ}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>
          </Grid2>
          <Box
            sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
          >
            <Button variant="outlined" onClick={resetFilters}>
              Reset
            </Button>
            <Button variant="contained" onClick={applyFilters}>
              Apply
            </Button>
          </Box>
        </Box>
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
              {/* Add additional form fields as needed */}
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
