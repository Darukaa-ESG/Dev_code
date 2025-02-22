import Grid from '@mui/material/Grid2'
import React, { useState } from 'react'
import { Box, Card, Typography } from '@mui/material'
import 'swiper/css';
import 'swiper/css/navigation';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import DMapDashBoard from '../DMap/DMapDashboard'
import ProjectListData from '../../../../db.json';
import { ProjectInfoCard, ProjectSitesCarousel } from '../../../common/cardComponent';
import areaCovered from '../../../../resources/images/site-area.png';
import cameraInstalled from '../../../../resources/images/site-camera.png'
import audioDevices from '../../../../resources/images/site-audio.png'
import ProjectOverview from '../../../../resources/images/Project_overview.png'
import Monitoring from '../../../../resources/images/Monitoring.png'
import HumanImpact from '../../../../resources/images/Human_impact.png'
import Biohealth from '../../../../resources/images/Biodiversity_heath.png'
import { getIntactnessRangeCategory } from '../../../../constants/index';
import { convertToNumber } from '../../../../constants/index';
import { getSpeciesAbundanceRangeCategory } from '../../../../constants/index';

const BiodiversityDashboardSiteInfo = () => {
    const [projectSite] = useState(ProjectListData.ProjectSite);
    const filterSpeciesData = projectSite[0][0]?.species_distribution

    const speciesData = [
        {
            name: 'Critically Endangered',
            value1: parseInt(filterSpeciesData ? filterSpeciesData[0].critically_endangered[0].total : ''),
            species: filterSpeciesData ? filterSpeciesData[0].critically_endangered[0].species_list.join(', ') : ''
        },
        {
            name: 'Endangered',
            value1: parseInt(filterSpeciesData ? filterSpeciesData[0].endangered[0].total : ''),
            species: filterSpeciesData ? filterSpeciesData[0].endangered[0].species_list.join(', ') : ''
        },
        {
            name: 'Vulnerable',
            value1: parseInt(filterSpeciesData ? filterSpeciesData[0].vulnerable[0]?.total : ''),
            species: filterSpeciesData ? filterSpeciesData[0].vulnerable[0].species_list.join(', ') : ''
        },
        {
            name: 'Near Threatened',
            value1: parseInt(filterSpeciesData ? filterSpeciesData[0].near_threatened[0].total : ''),
            species: filterSpeciesData ? filterSpeciesData[0].near_threatened[0].species_list.join(', ') : ''
        },
        {
            name: 'Least Concerned',
            value1: parseInt(filterSpeciesData ? filterSpeciesData[0].least_concerned[0].total : ''),
            species: filterSpeciesData ? filterSpeciesData[0].least_concerned[0].species_list.join(', ') : ''
        },
    ];
    const handleSelectSite = (site: string) => {
        console.log('site', site)
        localStorage.setItem('SelectedDropDownSite', JSON.stringify(site))
    };
    const chartData = speciesData.map(item => ({
        name: item.name,
        y: item.value1,
        description: item.species.split(', ').map((species) => `<br/>- ${species}`).join(''),
    }));
    const options = {
        chart: {
            type: 'pie',
        },
        title: {
            text: null,
        },
        credits: {
            enabled: false,
        },
        tooltip: {
            pointFormat: `
                Total No.: <b>{point.y}</b><br/>
                Species: <b>{point.description}</b><br/>
                Percentage: <b>{point.percentage:.1f}%</b>
            `,
        },
        legend: {
            enabled: true, // Ensure the legend is enabled
            layout: 'horizontal', // Arrange legends vertically
            align: 'center', // Align legends to the right
            verticalAlign: 'bottom', // Vertically align legends to the middle
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    distance: -30,
                    enabled: true,
                    format: `<b>{point.y}</b><br/>`,
                    style: {
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                    },
                },
                innerSize: '50%', // For donut effect
            },
        },
        series: [
            {
                name: 'Species',
                colorByPoint: true,
                showInLegend: true, // Enable legends for this series
                data: chartData, // Ensure this contains valid data
            },
        ],
    };

    return (
        <Box sx={{ mt: 5 }}>
            <Box className='bio-map' sx={{ mb: 3 }}>
                <DMapDashBoard />
            </Box>

            <Box sx={{
                border: '1px solid #ccc',
                backgroundColor: "#fff",
                marginTop: "5px",
                borderRadius: "8px",
                boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
            }}>
                <Typography sx={{ fontWeight: 600, fontSize: "22px", color: "#151E15", m: 2 }}>
                    {projectSite[0][0]?.project_name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #D9D9D9' }} gap={2} />
                <Grid container spacing={4}>

                    <ProjectInfoCard
                        imageSrc={ProjectOverview}
                        title="Project Details"
                        data={[
                            { label: "Project Id", value: projectSite[0][0]?.project_id },
                            { label: "Total Area", value: projectSite[0][0]?.total_area },
                            { label: "Total Sites", value: projectSite[0][0]?.number_of_sites },
                            { label: "Total Species Identified", value: projectSite[0][0]?.total_species_identified }
                        ]}
                    />
                    <ProjectInfoCard
                        imageSrc={Monitoring}
                        title="Monitoring & Data Collection"
                        data={[
                            { label: "Cameras Devices Installed", value: projectSite[0][0]?.cameras_installed },
                            { label: "Audio Devices Installed", value: projectSite[0][0]?.audio_devices_installed },
                            { label: "Total Images/Videos", value: projectSite[0][0]?.total_images_videos },
                            { label: "Audio Files", value: projectSite[0][0]?.total_audiofiles },

                        ]}
                    />
                    <ProjectInfoCard
                        imageSrc={Biohealth}
                        title="Biodiversity Health"
                        data={[
                            { label: "Biodiversity Score Index", value: projectSite[0][0]?.biodiversity_score, tooltip: "An overall indicator that combines multiple biodiversity metrics to represent the health and diversity of the ecosystem.• Good: 0.75 - 1.00 (Healthy and diverse ecosystem) • Medium: 0.50 - 0.74 (Moderate health, some loss of diversity) • Bad: 0.00 - 0.49 (Poor health, low biodiversity)", color: getIntactnessRangeCategory(convertToNumber(projectSite[0][0]?.biodiversity_score ?? 0)).color },
                            {
                                label: "Biodiversity Intactness Index", value: projectSite[0][0]?.biodiversity_intactness, tooltip: "A measure of how much of the original biodiversity remains intact in the ecosystem, relative to undisturbed conditions. • Good: 0.75 - 1.00 (High intactness, minimal disturbance) • Medium: 0.50 - 0.74 (Moderate disturbance, some biodiversity loss)• Bad: 0.00 - 0.49 (Severe disturbance, significant biodiversity loss)", color: getIntactnessRangeCategory(convertToNumber(projectSite[0][0]?.biodiversity_intactness
                                    ?? 0)).color
                            },
                            {
                                label: "Mean Species Abundance", value: projectSite[0][0]?.mean_species_abundance, tooltip: "The average abundance of native species in the area compared to their abundance in an undisturbed ecosystem.• Good: 0.70 - 1.00 (Abundance close to natural levels)• Medium: 0.40 - 0.69 (Reduced abundance, moderate impact)• Bad: 0.00 - 0.39 (Low abundance, high impact)", color: getSpeciesAbundanceRangeCategory(convertToNumber(projectSite[0][0]?.mean_species_abundance
                                    ?? 0)).color
                            },
                            {
                                label: "Potential Disappearance Fraction", value: projectSite[0][0]?.potential_disappearance_fraction, tooltip: "The estimated proportion of species at risk of disappearing due to environmental degradation or human impact.• Good: 0.00 - 0.20 (Low risk of species disappearance)• Medium: 0.21 - 0.40 (Moderate risk of species disappearance) • Bad: 0.41 - 1.00 (High risk of species disappearance)", color: getSpeciesAbundanceRangeCategory(convertToNumber(projectSite[0][0]?.potential_disappearance_fraction
                                    ?? 0)).color
                            },

                        ]}
                    />

                    <ProjectInfoCard
                        imageSrc={HumanImpact}
                        title="Human Impact"
                        data={[
                            {
                                label: "Human Intrusion Index", value: projectSite[0][0]?.human_intrusion_index, tooltip: "A measure of the extent and intensity of human activities affecting the ecosystem. • Good: 0.00 - 0.20 (Minimal human activity and low impact) • Medium: 0.21 - 0.50 (Moderate human activity and impact) • Bad: 0.51 - 1.00 (High human activity and severe impact)", color: getSpeciesAbundanceRangeCategory(convertToNumber(projectSite[0][0]?.potential_disappearance_fraction
                                    ?? 0)).color
                            },
                        ]}
                    />
                </Grid>
            </Box>

            <Grid size={{ lg: 4, md: 6 }} sx={{ marginTop: '10px' }}>
                <Card sx={{
                    boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
                    borderRadius: '8px',
                    backgroundColor: '#fff',
                }}>
                    <Typography
                        component="div"
                        sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
                    >{'Species Distribution by Threat Level'}
                    </Typography>
                    <Box className='divider' sx={{ p: 2 }} />
                    <HighchartsReact highcharts={Highcharts} options={options} />
                </Card>
            </Grid>
            <ProjectSitesCarousel
                title="Project Sites"
                data={projectSite[0][0]?.sites}
                detailPage="/biodiversity-analysis-detail"
                handleSelectSite={handleSelectSite}
                siteAttributes={[
                    { key: "area", label: "Area Covered", icon: areaCovered },
                    { key: "camera_installed", label: "Cameras Installed", icon: cameraInstalled },
                    { key: "audio_devices", label: "Audio Devices", icon: audioDevices },
                ]}
            />
        </Box>
    )
}

export default BiodiversityDashboardSiteInfo