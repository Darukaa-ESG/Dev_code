import React, { useState } from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import { Box, Card, Typography } from '@mui/material';
import Grid from '@mui/material/Grid2'
import 'swiper/css';
import 'swiper/css/navigation';
import { getRiskValue, SolidGaugeChart } from './ClimateCharts';
import ChartProjectionComponent from './climateProperty';
import DMapDashBoard from '../DMap/DMapDashboard';
import ProjectListData from '../../../../db.json';
import areaCovered from '../../../../resources/images/site-area.png';
import scoreCovered from '../../../../resources/images/score.png';
import categoryCovered from '../../../../resources/images/category.png';
import ProjectOverview from '../../../../resources/images/Project_overview.png'
import EnvPara from '../../../../resources/images/envparameter.png'
import { getIntactnessRangeCategory } from '../../../../constants/index';
import { convertToNumber } from '../../../../constants/index';
import { ProjectInfoCard, ProjectSitesCarousel } from '../../../common/cardComponent';

const EnvDashboard = () => {
  const [projectSite] = useState(ProjectListData.Environmental);

  const filterClimateProjecion = projectSite[0].Climate_Projections;

  const filterOptimisticDayNearTerm = filterClimateProjecion[0].Optimistic_Scenario.Near_Term;
  const filterOptimisticDayMidTerm = filterClimateProjecion[0].Optimistic_Scenario.Mid_Term;
  const filterOptimisticDayLongTerm = filterClimateProjecion[0].Optimistic_Scenario.Long_Term;

  const filterIntermidiateNearTerm = filterClimateProjecion[0].Intermediate_Scenario.Near_Term;
  const filterIntermidiateMidTerm = filterClimateProjecion[0].Intermediate_Scenario.Mid_Term;
  const filterIntermidiateLongTerm = filterClimateProjecion[0].Intermediate_Scenario.Long_Term;

  const filterExtremeNearTerm = filterClimateProjecion[0].Extreme_Scenario.Near_Term;
  const filterExtremeMidTerm = filterClimateProjecion[0].Extreme_Scenario.Mid_Term;
  const filterExtremeLongTerm = filterClimateProjecion[0].Extreme_Scenario.Long_Term;

  const filterOptimisticCycloneNearTerm = filterClimateProjecion[0].Optimistic_Scenario.Near_Term;
  const filterOptimisticCycloneMidTerm = filterClimateProjecion[0].Optimistic_Scenario.Mid_Term;
  const filterOptimisticCycloneLongTerm = filterClimateProjecion[0].Optimistic_Scenario.Long_Term;

  const filterIntermidiateCycloneNearTerm = filterClimateProjecion[0].Intermediate_Scenario.Near_Term;
  const filterIntermidiateCycloneMidTerm = filterClimateProjecion[0].Intermediate_Scenario.Mid_Term;
  const filterIntermidiateCycloneLongTerm = filterClimateProjecion[0].Intermediate_Scenario.Long_Term;

  const filterExtremeCycloneNearTerm = filterClimateProjecion[0].Extreme_Scenario.Near_Term;
  const filterExtremeCycloneMidTerm = filterClimateProjecion[0].Extreme_Scenario.Mid_Term;
  const filterExtremeCycloneLongTerm = filterClimateProjecion[0].Extreme_Scenario.Long_Term;

  const chartData1 = {
    optimisticNearTerm: parseFloat(filterOptimisticDayNearTerm.Consecutive_Dry_Days.change),
    optimisticMidTerm: parseFloat(filterOptimisticDayMidTerm.Consecutive_Dry_Days.change),
    optimisticLongTerm: parseFloat(filterOptimisticDayLongTerm.Consecutive_Dry_Days.change),

    intermediaryNearTerm: parseFloat(filterIntermidiateNearTerm.Consecutive_Dry_Days.change),
    intermediaryMidTerm: parseFloat(filterIntermidiateMidTerm.Consecutive_Dry_Days.change),
    intermediaryLongTerm: parseFloat(filterIntermidiateLongTerm.Consecutive_Dry_Days.change),

    extremeNearTerm: parseFloat(filterExtremeNearTerm.Consecutive_Dry_Days.change),
    extremeMidTerm: parseFloat(filterExtremeMidTerm.Consecutive_Dry_Days.change),
    extremeLongTerm: parseFloat(filterExtremeLongTerm.Consecutive_Dry_Days.change),
  };

  const chartOptions1 = {
    chart: {
      type: 'column',  // Set chart type to bar
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: ['Near Term', 'Mid Term', 'Long Term'], // Categories for x-axis
    },
    yAxis: {
      title: {
        text: 'Consecutive Dry Days',
      },
      stackLabels: {
        enabled: true,  // Show stack labels
        style: {
          fontWeight: 'bold',
          color: 'gray',
        },
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: 'days',
    },
    series: [
      {
        name: 'Optimistic',
        data: [
          chartData1.optimisticNearTerm,
          chartData1.optimisticMidTerm,
          chartData1.optimisticLongTerm,
        ],
        color: '#8884d8',
      },
      {
        name: 'Intermediary',
        data: [
          chartData1.intermediaryNearTerm,
          chartData1.intermediaryMidTerm,
          chartData1.intermediaryLongTerm,
        ],
        color: '#ff6347', // Red
      },
      {
        name: 'Extreme',
        data: [
          chartData1.extremeNearTerm,
          chartData1.extremeMidTerm,
          chartData1.extremeLongTerm,
        ],
        color: '#ff0000', // Dark Red
      },
    ],
  };

  const chartData2 = {
    optimisticNearTerm: parseFloat(filterOptimisticCycloneNearTerm.Cyclone_Frequency.change),
    optimisticMidTerm: parseFloat(filterOptimisticCycloneMidTerm.Cyclone_Frequency.change),
    optimisticLongTerm: parseFloat(filterOptimisticCycloneLongTerm.Cyclone_Frequency.change),

    intermediaryNearTerm: parseFloat(filterIntermidiateCycloneNearTerm.Cyclone_Frequency.change),
    intermediaryMidTerm: parseFloat(filterIntermidiateCycloneMidTerm.Cyclone_Frequency.change),
    intermediaryLongTerm: parseFloat(filterIntermidiateCycloneLongTerm.Cyclone_Frequency.change),

    extremeNearTerm: parseFloat(filterExtremeCycloneNearTerm.Cyclone_Frequency.change),
    extremeMidTerm: parseFloat(filterExtremeCycloneMidTerm.Cyclone_Frequency.change),
    extremeLongTerm: parseFloat(filterExtremeCycloneLongTerm.Cyclone_Frequency.change),
  };

  const chartOptions2 = {
    chart: {
      type: 'column',  // Set chart type to bar
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: ['Near Term', 'Mid Term', 'Long Term'], // Categories for x-axis
    },
    yAxis: {
      title: {
        text: 'Cyclone Frequency',
      },
      stackLabels: {
        enabled: true,  // Show stack labels
        style: {
          fontWeight: 'bold',
          color: 'gray',
        },
      },
    },
    tooltip: {
      shared: true,
      valueSuffix: 'cyclone',
    },
    series: [
      {
        name: 'Optimistic',
        data: [
          chartData2.optimisticNearTerm,
          chartData2.optimisticMidTerm,
          chartData2.optimisticLongTerm,
        ],
        color: '#00aaff',
      },
      {
        name: 'Intermediary',
        data: [
          chartData2.intermediaryNearTerm,
          chartData2.intermediaryMidTerm,
          chartData2.intermediaryLongTerm,
        ],
        color: '#ff6347', // Red
      },
      {
        name: 'Extreme',
        data: [
          chartData2.extremeNearTerm,
          chartData2.extremeMidTerm,
          chartData2.extremeLongTerm,
        ],
        color: '#ff0000', // Dark Red
      },
    ],
  };
  const acuteRisksCategory = [
    { name: "Cold Stress", riskLevel: projectSite[0].Acute_risks[0].Extreme_cold_risk, value: getRiskValue(projectSite[0]?.Acute_risks[0].Extreme_cold_risk) },
    { name: "Precipitation", riskLevel: projectSite[0]?.Acute_risks[0].Extreme_precipitation_risk, value: getRiskValue(projectSite[0]?.Acute_risks[0].Extreme_precipitation_risk) },
    { name: "Landslide", riskLevel: projectSite[0]?.Acute_risks[0].Landslide_risk, value: getRiskValue(projectSite[0]?.Acute_risks[0].Landslide_risk) },
    { name: "Cyclone", riskLevel: projectSite[0]?.Acute_risks[0].Tropical_cyclone_risk, value: getRiskValue(projectSite[0]?.Acute_risks[0].Tropical_cyclone_risk) },
    { name: "Wildfire", riskLevel: projectSite[0]?.Acute_risks[0].Wildfire_risk, value: getRiskValue(projectSite[0]?.Acute_risks[0].Wildfire_risk) },
  ];
  const ChronicRisksCategory = [
    { name: "Flood", riskLevel: projectSite[0]?.Chronic_risks[0].Flood_risk, value: getRiskValue(projectSite[0]?.Chronic_risks[0].Flood_risk) },
    { name: "Drought", riskLevel: projectSite[0]?.Chronic_risks[0].Drought_risk, value: getRiskValue(projectSite[0]?.Chronic_risks[0].Drought_risk) },
    { name: "Heat Wave", riskLevel: projectSite[0]?.Chronic_risks[0].Extreme_heat_risk, value: getRiskValue(projectSite[0]?.Chronic_risks[0].Extreme_heat_risk) },
    { name: "Sea Level Rise", riskLevel: projectSite[0]?.Chronic_risks[0]["Sea Sea_level_rise_risk"], value: getRiskValue(projectSite[0]?.Chronic_risks[0]["Sea Sea_level_rise_risk"]) },
  ]
  const handleSelectEnvSite = (site: Record<string, unknown>) => {
    localStorage.setItem('SelectedDropDownEnvSite', JSON.stringify(site))
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Box className='bio-map' sx={{ mb: 3 }}>
        <DMapDashBoard />
      </Box>
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        border: '1px solid #ccc',
        backgroundColor: "#fff",
        margin: "10px 1px",
        borderRadius: "8px",
        padding: 2, // Added padding for content spacing
        maxHeight: "550px"
      }}>
        <Typography sx={{ fontWeight: 600, fontSize: "22px", color: "#151E15", marginBottom: 2 }}>
          {projectSite[0]?.project_name}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #D9D9D9' }} gap={2} />
        <Grid container spacing={4}>
          <ProjectInfoCard
            imageSrc={ProjectOverview}
            title="Emission & Removals"
            data={[
              { label: "Project Id", value: projectSite[0]?.project_id },
              { label: "Total Area", value: projectSite[0]?.total_area },
              { label: "Total Sites", value: projectSite[0]?.number_of_sites }
            ]}
          />
          <Grid size={{ xs: 6 }} >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src={EnvPara}
                alt="Project Overview"
                sx={{
                  width: "45px",
                  height: "35px",
                  objectFit: "contain", // Ensures the image fits within its dimensions
                }}
              />
              <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "#151E15", padding: "16px" }}>
                {'Environmental Parameters'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #D9D9D9' }} gap={2} />
            <Box sx={{ display: 'flex' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: "16px", marginLeft: "40px" }} gap={2}>
                <Box>
                  <Typography sx={{ color: "#666666", fontWeight: 600, fontSize: '16px' }}>
                    {'Overall Risk Score'}
                  </Typography>
                  <Typography sx={{ color: getIntactnessRangeCategory(convertToNumber(projectSite[0]?.Overall_risk_score ?? 0)).color, fontWeight: 500, fontSize: '20px' }}>
                    {projectSite[0]?.Overall_risk_score}
                  </Typography>
                </Box>
                <Box>
                  <Typography sx={{ color: "#666666", fontWeight: 600, fontSize: '16px' }}>
                    {'Value Risk'}
                  </Typography>
                  <Typography sx={{ color: "#000", fontWeight: 500, fontSize: '20px' }}>
                    {projectSite[0]?.Value_at_risk}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', padding: "16px" }} gap={2}>
                <Typography sx={{ color: "#666666", fontWeight: 600, fontSize: '16px' }}>
                  {'Overall Risk Category'}
                </Typography>
                <SolidGaugeChart
                  title={''}
                  value={getRiskValue(projectSite[0]?.Overall_risk_category)}
                  riskLevel={projectSite[0]?.Overall_risk_category as "High" | "Moderate" | "Low"}
                  riskLevelTitle={projectSite[0]?.Overall_risk_category}
                  isClickable={false}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6 }} className='project-box'>
            <Typography sx={{ fontWeight: 600, fontSize: "22px", color: "#151E15", m: 2 }}>
              {'Acute Risk'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #D9D9D9' }} gap={2} />
            <Box style={{ display: "flex", flexWrap: "wrap", gap: "16px", borderRadius: "10px" }}>
              {acuteRisksCategory.map((category, index) => (
                <Box key={index}
                  style={{ width: "200px" }}>
                  <SolidGaugeChart
                    title={category.name}
                    value={category.value}
                    riskLevel={category.riskLevel as "High" | "Moderate" | "Low" | "ModerateHigh" | "ModerateLow"}
                    riskLevelTitle={category.riskLevel}
                    isClickable={true}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid size={{ xs: 6 }} className="project-box">
            <Typography sx={{ fontWeight: 600, fontSize: "22px", color: "#151E15", m: 2 }}>
              {'Chronic Risk'}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #D9D9D9' }} gap={2} />
            <Box style={{ display: "flex", flexWrap: "wrap", gap: "16px", borderRadius: "10px" }}>
              {ChronicRisksCategory.map((category, index) => (
                <Box key={index}
                  style={{ width: "200px" }}>
                  <SolidGaugeChart
                    title={category.name}
                    value={category.value}
                    riskLevel={category.riskLevel as "High" | "Moderate" | "Low" | "ModerateHigh" | "ModerateLow"}
                    riskLevelTitle={category.riskLevel}
                    isClickable={true}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Card sx={{
        boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
        borderRadius: '8px',
        backgroundColor: '#fff',
      }}>
        <ChartProjectionComponent />
        <Box className='divider' sx={{ m: 1 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 6 }} sx={{ ml: 3 }}>
            <Typography
              component="div"
              sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
            >
              {'Consecutive Days'}
            </Typography>
            <Box className='divider' sx={{ m: 2 }} />
            <HighchartsReact highcharts={Highcharts} options={chartOptions1} />
          </Grid>
          <Box sx={{ borderLeft: '1px solid #c4c4c4' }} />
          <Grid size={{ xs: 5 }}>
            <Typography
              component="div"
              sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
            >
              {'Cyclone Frequency'}
            </Typography>
            <Box className='divider' sx={{ m: 2 }} />
            <HighchartsReact highcharts={Highcharts} options={chartOptions2} />
          </Grid>
        </Grid>
      </Card>
      <ProjectSitesCarousel
        title="Project Sites"
        data={projectSite[0]?.sites}
        detailPage="/environmentalreport-analysis-detail"
        handleSelectSite={handleSelectEnvSite}
        siteAttributes={[
          { key: "area", label: "Area Covered", icon: areaCovered },
          { key: "site_risk_score", label: "Site Risk Score", icon: scoreCovered },
          { key: "site_risk_category", label: "Site Risk Category", icon: categoryCovered },
        ]}
      />
    </Box>
  )
}

export default EnvDashboard