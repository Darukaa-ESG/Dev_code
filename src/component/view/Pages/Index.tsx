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
  Typography,
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
    start_date: "",
    end_date: "",
    status: "",
    country: "",
    description: "",
    project_type: "",
    number_of_sites: 1
  });
  const [sitesData, setSitesData] = useState([{
    name: "",
    type: "",
    boundaryFile: null
  }]);
  const [siteFile, setSiteFile] = useState<File | null>(null);
  const [boundaryFile, setBoundaryFile] = useState<File | null>(null);

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

  const handleBoundaryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setBoundaryFile(e.target.files[0]);
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

  const handleSitesNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newNumber = parseInt(e.target.value);
    setProjectData({ ...projectData, number_of_sites: newNumber });

    // Adjust sites array length
    const newSitesData = [...sitesData];
    if (newNumber > sitesData.length) {
      for (let i = sitesData.length; i < newNumber; i++) {
        newSitesData.push({ name: "", type: "", boundaryFile: null });
      }
    } else {
      newSitesData.splice(newNumber);
    }
    setSitesData(newSitesData);
  };

  const handleSiteInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const { name, value } = e.target;
    const newSitesData = [...sitesData];
    newSitesData[index] = { ...newSitesData[index], [name]: value };
    setSitesData(newSitesData);
  };

  const handleBoundaryFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.files && e.target.files[0]) {
      const newSitesData = [...sitesData];
      newSitesData[index] = { ...newSitesData[index], boundaryFile: e.target.files[0] };
      setSitesData(newSitesData);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("projectData", JSON.stringify(projectData));
    formData.append("sitesData", JSON.stringify(sitesData));

    // Append boundary files
    sitesData.forEach((site, index) => {
      if (site.boundaryFile) {
        formData.append("boundaryFiles", site.boundaryFile);
      }
    });

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setOpenDialog(false);
        setSnackbarOpen(true);
        // Reset form data
        setProjectData({
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
        setSiteData({
          name: "",
          type: "",
          area: "",
          cameras_installed: "",
          audio_devices: "",
        });
        setSiteFile(null);
        setBoundaryFile(null);
        fetchProjects();
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
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  required
                  name="name"
                  label="Project Name"
                  value={projectData.name}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="start_date"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={projectData.start_date}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  required
                  type="date"
                  name="end_date"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={projectData.end_date}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  select
                  fullWidth
                  required
                  name="status"
                  label="Project Status"
                  value={projectData.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Under development">Under development</MenuItem>
                  <MenuItem value="Under validation">Under validation</MenuItem>
                  <MenuItem value="Registered">Registered</MenuItem>
                </TextField>
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  required
                  name="country"
                  label="Country"
                  value={projectData.country}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  label="Description"
                  value={projectData.description}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  select
                  fullWidth
                  required
                  name="project_type"
                  label="Project Type"
                  value={projectData.project_type}
                  onChange={handleInputChange}
                >
                  <MenuItem value="ARR/WRC">ARR/WRC</MenuItem>
                  <MenuItem value="Physical VAR">Physical VAR</MenuItem>
                </TextField>
              </Grid2>
              <Grid2 xs={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="number_of_sites"
                  label="Number of Sites"
                  value={projectData.number_of_sites}
                  onChange={handleSitesNumberChange}
                  InputProps={{ inputProps: { min: 1 } }}
                />
              </Grid2>
            </Grid2>

            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Site Information</Typography>

            {sitesData.map((site, index) => (
              <Box key={index} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Site {index + 1}</Typography>
                <Grid2 container spacing={2}>
                  <Grid2 xs={4}>
                    <TextField
                      fullWidth
                      required
                      name="name"
                      label="Site Name"
                      value={site.name}
                      onChange={(e) => handleSiteInputChange(e, index)}
                    />
                  </Grid2>
                  <Grid2 xs={4}>
                    <TextField
                      select
                      fullWidth
                      required
                      name="type"
                      label="Site Type"
                      value={site.type}
                      onChange={(e) => handleSiteInputChange(e, index)}
                    >
                      <MenuItem value="Restoration">Restoration</MenuItem>
                      <MenuItem value="Conservation">Conservation</MenuItem>
                      <MenuItem value="VAR assessment">VAR assessment</MenuItem>
                    </TextField>
                  </Grid2>
                  <Grid2 xs={4}>
                    <TextField
                      type="file"
                      fullWidth
                      required
                      name="boundaryFile"
                      onChange={(e) => handleBoundaryFileChange(e, index)}
                      helperText="Upload .shp or .geojson file"
                      InputProps={{
                        inputProps: {
                          accept: ".shp,.geojson"
                        }
                      }}
                    />
                  </Grid2>
                </Grid2>
              </Box>
            ))}
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