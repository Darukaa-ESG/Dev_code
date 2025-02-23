import React, { useState, useEffect } from 'react'
import { db } from '../../../../db/models';
import Grid from '@mui/material/Grid2';
import { Box, Typography } from '@mui/material';
import 'swiper/css';
import 'swiper/css/navigation';
import DMapDashBoard from '../DMap/DMapDashboard';
import { ChartComponent } from '../../../common/chartComponent';
import areaCovered from '../../../../resources/images/site-area.png';
import plantationCovered from '../../../../resources/images/planted_area.png'
import treeCovered from '../../../../resources/images/tree (2).png'
import ProjectOverview from '../../../../resources/images/Project_overview.png'
import EnvPara from '../../../../resources/images/envparameter.png'
import CarbonStock from '../../../../resources/images/biomass&cstock.png'
import Emission from '../../../../resources/images/emission.png'
import { Site } from '../../../../Interface/Index';
import { ProjectInfoCard, ProjectSitesCarousel } from '../../../common/cardComponent';

const CarbonDashboard = () => {
    const [projectCarbon, setProjectCarbon] = useState<any>(null);

    useEffect(() => {
        const fetchData = async () => {
            const project = await db.getProjects();
            if (project && project.length > 0) {
                const carbonMetrics = await db.getCarbonMetrics(project[0].id);
                const sites = await db.getSitesByProjectId(project[0].id);
                setProjectCarbon([{
                    ...project[0],
                    ...carbonMetrics,
                    sites
                }]);
            }
        };
        fetchData();
    }, []);

    if (!projectCarbon) {
        return <div>Loading...</div>;
    }

    const filterGHGReductionData = projectCarbon[0]["estimated_ghg_emissions_removals"]

    const transformedData = Object.entries(filterGHGReductionData)
        .filter(([key]) => key !== "unit")
        .map(([key, value]) => ({
            name: key,
            value1: Number(value),
            value2: undefined,
            date: undefined
        }));
    const handleSelectSite = (site: Site) => {
        console.log('site', site)
        localStorage.setItem('SelectedDropDownCarbonSite', JSON.stringify(site))
    }
    return (
        <Box sx={{ mt: 5 }}>
            <Box className='bio-map' mb={3}>
                <DMapDashBoard />
            </Box>

            <Box sx={{
                border: '1px solid #ccc',
                backgroundColor: "#fff",
                borderRadius: "8px",
                boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
                marginTop: "5px"
            }}>
                <Typography sx={{ fontWeight: 600, fontSize: "22px", color: "#151E15", m: 2 }}>
                    {projectCarbon[0]?.project_name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #D9D9D9' }} gap={1} />

                <Grid container spacing={4}>
                    <ProjectInfoCard
                        imageSrc={ProjectOverview}
                        title="Project Details"
                        data={[
                            { label: "Project Id", value: projectCarbon[0]?.id },
                            { label: "Total Area", value: `${projectCarbon[0]?.total_area} ${projectCarbon[0]?.total_area_unit}` },
                            { label: "Total Sites", value: projectCarbon[0]?.number_of_sites },
                        ]}
                    />

                    <ProjectInfoCard
                        imageSrc={EnvPara}
                        title="Environmental Parameters"
                        data={[
                            { label: "Average Temperature", value: `${projectCarbon[0]?.temperature} ${projectCarbon[0]?.temperature_unit}` },
                            { label: "Average Precipitation", value: `${projectCarbon[0]?.precipitation} ${projectCarbon[0]?.precipitation_unit}` },
                            { label: "Soil Type", value: projectCarbon[0]?.soil_type },
                        ]}
                    />

                    <ProjectInfoCard
                        imageSrc={CarbonStock}
                        title="Carbon Stock & Biomass"
                        data={[
                            { label: "Total Mean Biomass", value: `${projectCarbon[0]?.total_mean_biomass} ${projectCarbon[0]?.total_mean_biomass_unit}` },
                            {
                                label: "Total Mean Carbon Stock", value: `${projectCarbon[0]?.total_mean_carbon_stock} ${projectCarbon[0]?.total_mean_carbon_stock_unit}`
                            }
                        ]}
                    />
                    <ProjectInfoCard
                        imageSrc={Emission}
                        title="Emission & Removals"
                        data={[
                            { label: "Estimated GHG Baseline Emissions", value: `${projectCarbon[0]?.estimated_ghg_baseline_emissions} ${projectCarbon[0]?.estimated_ghg_baseline_emissions_unit}` },
                            { label: "Total Removals", value: `${projectCarbon[0]?.total_removals} ${projectCarbon[0]?.total_removals_unit}` },
                            { label: "Annual Removals", value: `${projectCarbon[0]?.average_annual_removals} ${projectCarbon[0]?.average_annual_removals_unit}` }
                        ]}
                    />
                </Grid>
            </Box>

            <Grid size={{ lg: 4, md: 6 }} sx={{ marginTop: '10px' }}>
                <ChartComponent chartType={'column'} chartTitle={'Estimated GHG Emissions reduction/removals'} data={transformedData} title=' tCO2e' seriesValue1=' tCO2e' yTitle='Year' />
            </Grid>

            <ProjectSitesCarousel
                title="Project Sites"
                data={projectCarbon[0]?.sites}
                detailPage="/carbonanalysis-analysis-detail"
                handleSelectSite={handleSelectSite}
                siteAttributes={[
                    { key: "total_area", label: "Area Covered", icon: areaCovered },
                    { key: "total_plantation_area", label: "Total Plantation Area", icon: plantationCovered },
                    { key: "total_planted_trees", label: "Total Planted Trees", icon: treeCovered },
                ]}
            />
        </Box>
    )
}

export default CarbonDashboard