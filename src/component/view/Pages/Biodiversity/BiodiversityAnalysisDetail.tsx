import { useEffect, useState } from 'react';
import { Box, Card, Typography } from '@mui/material'
import Grid from '@mui/material/Grid2'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import { ChartComponent } from '../../../common/chartComponent';
import ProjectListData from '../../../../db.json';
import { SiteCard, SiteDetailCard } from '../../../common/detailComponent';
import SiteArea from '../../../../resources/images/area-covered.svg'
import SiteCamera from '../../../../resources/images/sitecamera.svg'
import SiteAudio from '../../../../resources/images/siteaudio.svg'
import SiteSpecies from '../../../../resources/images/sitespecies.svg'
import SiteImage from '../../../../resources/images/siteimg.svg'
import SiteFile from '../../../../resources/images/sitefile.svg'
import BiodiversityDownloadFilter from './BiodiversityDownloadFilter';
import { getSpeciesAbundanceRangeCategory, getPotentialRangeCategory, getIntactnessRangeCategory, getShannonRangeCategory, getTaxonomicDissimilarityRangeCategory, getHabitatHealthRangeCategory, getHumanIntrusionRangeCategory } from '../../../../constants/index';
import { convertToNumber } from '../../../../constants/index';
import HumanImpact from '../../../../resources/images/Human_impact.png'
import Richness from '../../../../resources/images/SPECIES_RICHNESS.png'
import HealthHabitat from '../../../../resources/images/HABITAT_HEATH.jpeg'
import OverallHealth from '../../../../resources/images/OVERALL_HEALTH.png'
import DMapBioAnalysis from '../DMap/DMapBioAnalysis';
import { ProjectInfoCard } from '../../../common/cardComponent';

const BiodiversityAnalysisDetail = () => {
  const [projectSite] = useState(ProjectListData.ProjectSite);
  const siteDetails = JSON.parse(localStorage.getItem('site') || '[]');
  const [siteDropDownDetails, setSiteDropDownDetails] = useState(JSON.parse(localStorage.getItem('SelectedDropDownSite') || '[]'));
  const getChartData = projectSite && projectSite[0][0].sites.filter((i) => i.site_name === siteDropDownDetails.site_name || i.site_name === siteDetails.site_name);
  const filterSpeciesData = (getChartData ? siteDropDownDetails?.species_distribution : siteDetails?.species_distribution)
  const filterSpeciesDetected = (getChartData ? siteDropDownDetails?.species_detected : siteDetails?.species_detected)

    useEffect(() => {
      const intervalId = setInterval(() => {
        const updatedDetails = JSON.parse(
          localStorage.getItem("SelectedDropDownSite") || "{}"
        );
        if (JSON.stringify(updatedDetails) !== JSON.stringify(siteDropDownDetails)) {
          setSiteDropDownDetails(updatedDetails);
        }
      }, 500);
  
      return () => clearInterval(intervalId);
    }, [siteDropDownDetails]);

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
  const speciesFilterData = speciesData.map(item => ({
    name: item.name,
    y: item.value1,
    description: item.species.split(', ').map((species: string) => `<br/>- ${species}`).join(''),
  }));

  const speciesOptions = {
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
        data: speciesFilterData, // Ensure this contains valid data
      },
    ],
  };


  const speciesDetected = Object.keys(filterSpeciesDetected[0])?.map((year) => {
    const yearData = filterSpeciesDetected[0][year] || { image_species: [], audio_species: [] };
    const totalImages = yearData.image_species?.length || 0;
    const totalAudio = yearData.audio_species?.length || 0;

    return {
      year: `${year}`,
      images: totalImages,
      audio: totalAudio,
    };
  });

  // Ensure 2024 is included explicitly
  if (!speciesDetected.find((item) => item.year === "2024")) {
    speciesDetected.push({
      year: "2024",
      images: filterSpeciesDetected[0]["2024"]?.image_species?.length,// get the correct length
      audio: filterSpeciesDetected[0]["2024"]?.audio_species?.length,   // get the correct length
    });
  }

  const years = Object.keys(filterSpeciesDetected[0]);
  const seriesData = [
    {
      name: "Image", // Category 1
      data: years.map((year) => {
        const imageSpeciesCount = filterSpeciesDetected[0][year]?.image_species?.length || 0;

        return imageSpeciesCount; // Ensure we default to 0 if image_species is undefined
      }),
      color: "#7cb5ec", // Color for image
    },
    {
      name: "Audio", // Category 2
      data: years.map((year) => filterSpeciesDetected[0][year]?.audio_species?.length || 0), // Audio count
      color: "#434348", // Color for audio
    },
  ];

  const totalSpeciesDetected =
    siteDropDownDetails?.species_detected?.[0]
    || siteDetails?.species_detected?.[0]
    || null; // Fallback to `null` if no valid data is found

  if (!totalSpeciesDetected) {
    console.warn("No species detected data available.");
  }

  const totalSpeciesFile =
    Number(siteDropDownDetails?.species_detected[0]?.[2023]?.total_species ?? 0) +
    Number(siteDropDownDetails?.species_detected[0]?.[2024]?.total_species ?? 0);

  const totalAudioFiles =
    Number(siteDropDownDetails?.species_detected[0]?.[2023]?.total_audio_files ?? 0) +
    Number(siteDropDownDetails?.species_detected[0]?.[2024]?.total_audio_files ?? 0);

  const totalCameraImages =
    Number(siteDropDownDetails?.species_detected[0]?.[2023]?.total_camera_images ?? 0) +
    Number(siteDropDownDetails?.species_detected[0]?.[2024]?.total_camera_images ?? 0);

  const bioTrendScore = siteDropDownDetails.biodiversity_score_trend;
  const bioIntactnessTrendScore = siteDropDownDetails.biodiversity_intactness_trend;
  const meanSpeciesTrendScore = siteDropDownDetails.mean_species_abundance_trend;
  const speciesActivityTrendScore = siteDropDownDetails.species_activity_trend;
  const potentialTrendScore = siteDropDownDetails.potential_disappearance_fraction_trend;
  const humanActivityTrendScore = siteDropDownDetails.human_activity_trend;

  const bioTrendScoreData = bioTrendScore
    ? Object.keys(bioTrendScore[0]).map((year) => ({
      name: year,
      value1: parseFloat(bioTrendScore[0][year]), // Use parseFloat to handle decimals
    }))
    : [];
  const bioIntactnessScoreData = bioIntactnessTrendScore
    ? Object.keys(bioIntactnessTrendScore[0]).map((year) => ({
      name: year,
      value1: parseFloat(bioIntactnessTrendScore[0][year]), // Use parseFloat to handle decimals
    }))
    : [];
  const meanSpeciesScoreData = meanSpeciesTrendScore
    ? Object.keys(meanSpeciesTrendScore[0]).map((year) => ({
      name: year,
      value1: parseFloat(meanSpeciesTrendScore[0][year]), // Use parseFloat to handle decimals
    }))
    : [];
  const speciesActivityScoreData = speciesActivityTrendScore
    ? Object.keys(speciesActivityTrendScore[0]).map((year) => ({
      name: year,
      value1: parseFloat(speciesActivityTrendScore[0][year]), // Use parseFloat to handle decimals
    }))
    : [];
  const potentialFractionTrendScoreData = potentialTrendScore
    ? Object.keys(potentialTrendScore[0]).map((year) => ({
      name: year,
      value1: parseFloat(potentialTrendScore[0][year]), // Use parseFloat to handle decimals
    }))
    : [];
  const humanActivityTrendScoreData = humanActivityTrendScore
    ? Object.keys(humanActivityTrendScore[0]).map((year) => ({
      name: year,
      value1: parseFloat(humanActivityTrendScore[0][year]), // Use parseFloat to handle decimals
    }))
    : [];


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  }, []);

  const config = {
    chart: {
      type: "column", // Stacked column chart
    },
    title: {
      text: null, // Title of the chart
    },
    xAxis: {
      categories: years, // Use years as categories on the x-axis
      title: {
        text: "Year", // Label for x-axis
      },
    },
    yAxis: {
      min: 0, // Set minimum value for y-axis
      title: {
        text: "Number of Observations", // Label for y-axis
      },
      stackLabels: {
        enabled: true, // Enable stack labels on bars
        style: {
          fontWeight: "bold", // Style for stack labels
          color: "black", // Color for stack labels (white)
        },
      },
    },
    tooltip: {
      shared: true, // Share tooltip for stacked bars
      formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
        return `<b>${this.x}</b><br/>` +
          this.points
            ?.map(
              (point) =>
                `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: ${point.y}`
            )
            .join("<br/>");
      },
    },
    plotOptions: {
      column: {
        stacking: "normal", // Enable stacking for column chart
        dataLabels: {
          enabled: true, // Enable data labels inside the columns
        },
      },
    },
    series: seriesData
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box className="bio-map">
        <DMapBioAnalysis />
      </Box>

      <SiteDetailCard siteTitle={siteDropDownDetails?.site_name} siteDetail={siteDropDownDetails?.type} />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{ m: 1.5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SiteCard
            title={'Area Covered'}
            amount={siteDropDownDetails?.area}
            icon={SiteArea} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SiteCard
            title={'Cameras Installed'}
            amount={siteDropDownDetails?.camera_installed}
            icon={SiteCamera} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SiteCard
            title={'Audio Devices'}
            amount={siteDropDownDetails?.audio_devices}
            icon={SiteAudio} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SiteCard
            title={'Species Identified'}
            amount={totalSpeciesFile}
            icon={SiteSpecies} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SiteCard
            title={'Images & Videos'}
            amount={totalCameraImages}
            icon={SiteImage} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <SiteCard
            title={'Audio Files'}
            amount={totalAudioFiles}
            icon={SiteFile} />
        </Grid>
      </Grid>

      <Box
        sx={{
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '2px',
          backgroundColor: "#fff",
          margin: "10px",
          borderRadius: '8px',
          boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
        }}
      >
        <Grid container>

          <ProjectInfoCard
            imageSrc={OverallHealth}
            title="Overall Biodiversity Health"
            data={[
              { label: "Biodiversity Score Index", value: siteDropDownDetails.biodiversity_score, tooltip: "An overall indicator that combines multiple biodiversity metrics to represent the health and diversity of the ecosystem. • Good: 0.75 - 1.00 (Healthy and diverse ecosystem)• Medium: 0.50 - 0.74 (Moderate health, some loss of diversity) • Bad: 0.00 - 0.49 (Poor health, low biodiversity)", color: getIntactnessRangeCategory(convertToNumber(siteDropDownDetails.biodiversity_score ?? 0)).color },
              {
                label: "Biodiversity Intactness Index", value: siteDropDownDetails.biodiversity_intactness_index, tooltip: "A measure of how much of the original biodiversity remains intact in the ecosystem, relative to undisturbed conditions.• Good: 0.75 - 1.00 (High intactness, minimal disturbance) • Medium: 0.50 - 0.74 (Moderate disturbance, some biodiversity loss) • Bad: 0.00 - 0.49 (Severe disturbance, significant biodiversity loss)", color: getIntactnessRangeCategory(convertToNumber(siteDropDownDetails.biodiversity_intactness_index ?? 0)).color
              },
              {
                label: "Mean Species Abundance", value: siteDropDownDetails.mean_species_abundance, tooltip: "The average abundance of native species in the area compared to their abundance in an undisturbed ecosystem. • Good: 0.70 - 1.00 (Abundance close to natural levels) • Medium: 0.40 - 0.69 (Reduced abundance, moderate impact) • Bad: 0.00 - 0.39 (Low abundance, high impact)", color: getSpeciesAbundanceRangeCategory(convertToNumber(siteDropDownDetails.mean_species_abundance ?? 0)).color
              },
            ]}
          />

          <ProjectInfoCard
            imageSrc={Richness}
            title="Species Diversity and Richness"
            data={[
              { label: "Simpson Diversity Index", value: siteDropDownDetails.simpson_diversity, tooltip: "A measure of the probability that two randomly selected individuals belong to different species • Good: 0.75 - 1.00 (High diversity, evenly distributed species) • Medium: 0.50 - 0.74 (Moderate diversity) • Bad: 0.00 - 0.49 (Low diversity, dominated by few species)", color: getIntactnessRangeCategory(convertToNumber(siteDropDownDetails.simpson_diversity ?? 0)).color },
              {
                label: "Shannon Diversity Index", value: siteDropDownDetails.shanon_diversity, tooltip: "Quantifies species diversity by considering both the number of species and their relative abundance. • Good: 2.50+ (High diversity and even distribution) • Medium: 1.50 - 2.49 (Moderate diversity) • Bad: <1.50 (Low diversity, uneven distribution)", color: getShannonRangeCategory(convertToNumber(siteDropDownDetails.shanon_diversity ?? 0)).color
              },
              {
                label: "Species Diversity Index", value: siteDropDownDetails.species_diversity, tooltip: "Reflects the variety of species within a specific area, accounting for their abundance. • Good: 0.70 - 1.00 (High species variation)• Medium: 0.40 - 0.69 (Moderate species variation)• Bad: 0.00 - 0.39 (Low species variation)", color: getSpeciesAbundanceRangeCategory(convertToNumber(siteDropDownDetails.species_diversity ?? 0)).color
              },
              {
                label: "Species Richness Index", value: siteDropDownDetails.species_richness, tooltip: "Represents the total number of different species in a given area, without considering their abundance.• Good: 0.70 - 1.00 (Large number of species)• Medium: 0.40 - 0.69 (Moderate number of species)• Bad: 0.00 - 0.39 (Few species present)", color: getSpeciesAbundanceRangeCategory(convertToNumber(siteDropDownDetails.species_richness ?? 0)).color
              },
              {
                label: "Taxonomic Dissimilarity", value: siteDropDownDetails.taxonomic_dissimilarity, tooltip: "Measures the evolutionary or taxonomic differences between species within an ecosystem.• Good: 0.00 - 0.30 (Low taxonomic differences, more similar species) • Medium: 0.31 - 0.60 (Moderate taxonomic differences) • Bad: 0.61 - 1.00 (High taxonomic differences, more isolated species)", color: getTaxonomicDissimilarityRangeCategory(convertToNumber(siteDropDownDetails.taxonomic_dissimilarity ?? 0)).color
              },
              {
                label: "Habitat Spatial Index", value: siteDropDownDetails.habitat_spatial_structure, tooltip: "Evaluates the spatial arrangement and connectivity of habitats to sustain ecosystem functions. • Good: 70+ (Highly connected and well-arranged habitats) • Medium: 40 - 69 (Moderate connectivity and arrangement) • Bad: <40 (Poorly connected or fragmented habitats)", color: getIntactnessRangeCategory(convertToNumber(siteDropDownDetails.habitat_spatial_structure ?? 0)).color
              },
            ]}
          />
          <ProjectInfoCard
            imageSrc={HealthHabitat}
            title="Habitat Health"
            data={[
              { label: "Habitat Health Index", value: siteDropDownDetails.habitat_health, tooltip: "Assesses the condition and sustainability of habitats for supporting biodiversity.• Good: 0.75 - 1.00 (Healthy and sustainable habitats) • Medium: 0.50 - 0.74 (Moderately healthy habitats)• Bad: 0.00 - 0.49 (Degraded habitats)", color: getHabitatHealthRangeCategory(convertToNumber(siteDropDownDetails.habitat_health ?? 0)).color },
              {
                label: "Potential Disappearance Fraction", value: projectSite[0][0]?.potential_disappearance_fraction, tooltip: "The estimated proportion of species at risk of disappearing due to environmental degradation or human impact.• Good: 0.00 - 0.20 (Low risk of species disappearance)• Medium: 0.21 - 0.40 (Moderate risk of species disappearance) • Bad: 0.41 - 1.00 (High risk of species disappearance)", color: getPotentialRangeCategory(convertToNumber(projectSite[0][0]?.potential_disappearance_fraction ?? 0)).color
              },
            ]}
          />
          <ProjectInfoCard
            imageSrc={HumanImpact}
            title="Human Impact"
            data={[
              { label: "Species Protection Index", value: siteDropDownDetails.species_protection_index, tooltip: "Indicates the proportion of species in the area that are adequately protected through conservation efforts. • Good: 0.70 - 1.00 (Adequate protection for most species)• Medium: 0.40 - 0.69 (Moderate level of protection)• Bad: 0.00 - 0.39 (Poor species protection)", color: getSpeciesAbundanceRangeCategory(convertToNumber(siteDropDownDetails.species_protection_index ?? 0)).color },
              {
                label: "Human Intrusion Index", value: siteDropDownDetails.human_intrusion, tooltip: "Quantifies the level of human activity and its impact on the ecosystem.• Good: 0.00 - 0.20 (Minimal human activity and low impact)• Medium: 0.21 - 0.50 (Moderate human activity and impact)• Bad: 0.51 - 1.00 (High human activity and severe impact)", color: getHumanIntrusionRangeCategory(convertToNumber(siteDropDownDetails.human_intrusion ?? 0)).color
              },
              {
                label: "Species Information Index", value: siteDropDownDetails.species_info_index, tooltip: "Measures the availability and completeness of information about species in the area. • Good: 0.75 - 1.00 (Comprehensive species data available)• Medium: 0.50 - 0.74 (Moderate availability of species data)• Bad: 0.00 - 0.49 (Limited species data available)", color: getSpeciesAbundanceRangeCategory(convertToNumber(siteDropDownDetails.species_info_index ?? 0)).color
              },
            ]}
          />
        </Grid>

      </Box>

      <Box sx={{ m: 1 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 6 }}>
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
              <HighchartsReact highcharts={Highcharts} options={speciesOptions} />
            </Card>
          </Grid>

          <Grid size={{ xs: 6 }}>
            <Card sx={{
              boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
              borderRadius: '8px',
              backgroundColor: '#fff',
            }}>
              <Typography
                component="div"
                sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
              >{'No. of Observations per Species'}
              </Typography>
              <Box className='divider' sx={{ p: 2 }} />
              {/* <ChartComponent chartType={'bar'} chartTitle={''} data={chartData} title='Images/Audio' seriesValue1='Image' seriesValue2='Audio' /> */}
              {years.length > 0 && seriesData.length > 0 && (
                <HighchartsReact highcharts={Highcharts} options={config} />
              )}
            </Card>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'line'} chartTitle={'Biodiversity Score Trend'} data={bioTrendScoreData} title='Biodiversity Score' yTitle='Years' seriesValue1='Biodiversity Index Score' />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'line'} chartTitle={'Biodiversity Intactness Trend'} data={bioIntactnessScoreData} title=' Biodiversity Intactness Value' yTitle='Years' seriesValue1='Biodiversity Intactness Value' />
          </Grid>

          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'line'} chartTitle={'Mean Species Abundance Trend'} data={meanSpeciesScoreData} title='Mean Species Abundance Score' yTitle='Years' seriesValue1='Mean Species Abundance Score' />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'line'} chartTitle={'Potential Disappearance Fraction Trend'} data={potentialFractionTrendScoreData} title='Potential Disappearance Fraction Score' yTitle="Years" seriesValue1='Potential Disappearance Fraction' />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'line'} chartTitle={'Species Activity Trend'} data={speciesActivityScoreData} title='No. of Recorded Activities' yTitle='Hours/Time of the day' seriesValue1='No. of Recorded Activities' />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'line'} chartTitle={'Human Activity Trend'} data={humanActivityTrendScoreData} title='No. of Recorded Activities' seriesValue1='No. of Recorded Activities' yTitle='Hours/Time of the day' />
          </Grid>

        </Grid>
      </Box>
      <BiodiversityDownloadFilter />
    </Box>
  );
};

export default BiodiversityAnalysisDetail;

