import { Box, Button, Grid2, SelectChangeEvent } from "@mui/material"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CardComponent } from "../../common/cardComponent"
import SelectComponent from "../../common/selectComponent";
import TableComponent from "../../common/tableComponent";
import { PROJECT_COLUMN } from "../../../constants/projectTable";
import ProjectListData from '../../../db.json';
import { ProjectRowType, ProjectType } from "../../../Interface/Index";
import { Row } from "../../../Interface/tableProps";

const ProjectComponent = () => {
  const navigate = useNavigate();
  const [table, setTable] = useState<ProjectRowType[]>([]);
  const [loader, setLoader] = useState(false);
  const [tableTitle, setTableTitle] = useState('Recent Projects');
  const [projectList] = useState<ProjectType[]>(ProjectListData.ProjectList);
  const [projectName] = useState(ProjectListData.ProjectNamesArray);
  const [projectType] = useState(ProjectListData.ProjectTypeArray);
  const [projectCountry] = useState(ProjectListData.CountryNamesArray);
  const [projectRegistry] = useState(ProjectListData.registryNamesArray);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [selectedProjectRegistry, setSelectedProjectRegistry] = useState<number | null>(null);
  const [selectedProjectCountry, setSelectedProjectCountry] = useState<number | null>(null);
  const [selectedProjectType, setSelectedProjectType] = useState<number | null>(null);

  useEffect(() => {
    const projectRender = projectList.map((i) => ({
      name: i.project_name,
      status: i.project_status,
      start: i.project_start_date,
      end: i.project_end_date,
      type: i.project_type,
      country: i.country,
    }));
    setTable(projectRender);
  }, [projectList])

  const handleFilter = () => {
    let newTitle = ""

    const filteredProjects = projectList.filter((project) => {
      return (
        (!selectedProjectRegistry || project.registry === projectRegistry.find((r) => r.value === selectedProjectRegistry)?.label) &&
        (!selectedProjectCountry || project.country === projectCountry.find((c) => c.value === selectedProjectCountry)?.label) &&
        (!selectedProjectType || project.project_status === projectType.find((t) => t.value === selectedProjectType)?.label)
      );
    });

    const projectRender:ProjectRowType[] = filteredProjects.map((i) => ({
      name: i.project_name,
      status: i.project_status,
      start: i.project_start_date,
      end: i.project_end_date,
      type: i.project_type,
      country: i.country,
      registry: i.registry,
    }));
    setTable(projectRender);
    setTableTitle(newTitle)
  };
  const handleProjects = (event:SelectChangeEvent, child: React.ReactNode) => {
    const selectedValue = Number(event.target.value) || null;
    // const selectedValue = event.target.value;
    setSelectedProject(selectedValue);
  };

  const handleRunAssessment  = () => {
    if (selectedProject) {
      setLoader(true);
      const projectRender:ProjectRowType[] = projectList.map((i) => ({
        name: i.project_name,
        status: i.project_status,
        start: i.project_start_date,
        end: i.project_end_date,
        type: i.project_type,
        country: i.country,
      }));
      setTable(projectRender);
      navigate('/project-details')
    }
  };

  const handleProjectsType = (event: SelectChangeEvent, child: React.ReactNode) => {
    setSelectedProjectType(Number(event.target.value) || null)
  }
  const handleProjectsCountry = (event: SelectChangeEvent, child: React.ReactNode) => {
    setSelectedProjectCountry(Number(event.target.value) || null)
  }
  const handleProjectsRegistry = (event: SelectChangeEvent, child: React.ReactNode) => {
    const selectedValue = (Number(event.target.value) || null)
    setSelectedProjectRegistry(selectedValue);

    // Auto-fill based on registry selection
    const selectedRegistryDetails = projectList.find(
      (project) => project.registry === projectRegistry.find((r) => r.value === selectedValue)?.label
    );

    if (selectedRegistryDetails) {
      const matchingProjectName = projectName.find(
        (p) => p.label === selectedRegistryDetails.project_name
      );
      setSelectedProject(matchingProjectName?.value || null);
      const matchingCountry = projectCountry.find((c) => c.label === selectedRegistryDetails.country);
      const matchingType = projectType.find((t) => t.label === selectedRegistryDetails.project_status);
      setSelectedProjectCountry(matchingCountry?.value || null);
      setSelectedProjectType(matchingType?.value || null);
    } else {
      // Reset auto-filled fields if no match is found
      setSelectedProject(null);
      setSelectedProjectCountry(null);
      setSelectedProjectType(null);
    }
  };

  const handleReset = () => {
    setSelectedProject(null);
    setSelectedProjectRegistry(null);
    setSelectedProjectCountry(null);
    setSelectedProjectType(null);
  }
  return (
    <Box>
      <CardComponent title={'Project Filter'}>
        <Box p={2}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ lg: 12, sm: 6 }}>
              <SelectComponent label={"Project"} options={projectName} value={selectedProject} onChange={handleProjects}
                displayEmpty={true}
                renderValue={(value) =>
                  value ? projectName.find((p) => p.value === value)?.label : "Select Project"
                }
              />
            </Grid2>
            <Grid2 size={{ lg: 4, sm: 6 }}>
              <SelectComponent label={"Registry Name"} options={projectRegistry} value={selectedProjectRegistry} onChange={handleProjectsRegistry} />
            </Grid2>
            <Grid2 size={{ lg: 4, sm: 6 }}>
              <SelectComponent label={"Country"} options={projectCountry} value={selectedProjectCountry} onChange={handleProjectsCountry} />
            </Grid2>
            <Grid2 size={{ lg: 4, sm: 6 }}>
              <SelectComponent label={"Project Type"} options={projectType} value={selectedProjectType} onChange={handleProjectsType} />
            </Grid2>

          </Grid2>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #D9D9D9' }} gap={2} p={2}>
          <Button variant="outlined" sx={{ borderColor: '#005F54', color: '#005F54' }} onClick={handleReset}>Reset</Button>
          {selectedProject && !selectedProjectRegistry && !selectedProjectCountry && !selectedProjectType ? (
            <Button variant="contained" sx={{ backgroundColor: "#005F54", color: "#fff", }} onClick={handleRunAssessment}>Run Assessment</Button>
          ) : (
            <Button variant="contained" sx={{ backgroundColor: "#005F54", color: "#fff", }} onClick={handleFilter}>Apply</Button>
          )}
        </Box>
      </CardComponent>

      <Box mt={3}>
        <TableComponent
          title={tableTitle}
          rows={table as any as Row[]}
          columns={PROJECT_COLUMN}
          link="/project-details"
        />
      </Box>
    </Box>
  )
}

export default ProjectComponent