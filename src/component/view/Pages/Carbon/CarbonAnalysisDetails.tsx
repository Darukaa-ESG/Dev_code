import Grid from '@mui/material/Grid2'
import React, { useEffect, useState } from 'react'
import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts'
import DMapAnalysis from '../DMap/DMapAnalysis';
import DMapCANew from '../DMap/DMapCANew';
import ProjectListData from '../../../../db.json';
import { Box, Card, Typography } from '@mui/material';
import { ChartComponent } from '../../../common/chartComponent';
import { SiteDetailCard, SiteCard } from '../../../common/detailComponent';
import SiteArea from '../../../../resources/images/area_site.png'
import SitePlantation from '../../../../resources/images/planted_area_site (1).png'
import SiteTree from '../../../../resources/images/planted_tree_site.png'
import { CreditCard } from '../../../common/cardComponent';

const CarbonAnalysisDetails = () => {
  const [projectSite] = useState(ProjectListData.CarbonCredit);
  const [categories, setCategories] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<{ name: string; data: number[] }[]>([]);
  const [siteDropDownDetails, setSiteDropDownDetails] = useState<Record<string, any>>(
    JSON.parse(localStorage.getItem("SelectedDropDownCarbonSite") || "{}")
  );
  const getChartData = projectSite && projectSite[0].sites.filter((i) => i.site_name === siteDropDownDetails.site_name);
  const filterTransitionData = (getChartData ? siteDropDownDetails?.lulc_transition_piechart : '')
  const filterTimeSeriesData = (getChartData ? siteDropDownDetails?.lulc_timeseries : '')
  const filterWaterData = (getChartData ? siteDropDownDetails?.surface_water_transition : '')
  const filterSoilData = (getChartData ? siteDropDownDetails?.soc : '')
  const filterSoilPropertyData = (getChartData ? siteDropDownDetails?.soil_properties : '')

  useEffect(() => {
    const intervalId = setInterval(() => {
      const updatedDetails = JSON.parse(
        localStorage.getItem("SelectedDropDownCarbonSite") || "{}"
      );
      if (JSON.stringify(updatedDetails) !== JSON.stringify(siteDropDownDetails)) {
        setSiteDropDownDetails(updatedDetails);
      }
    }, 500);

    return () => clearInterval(intervalId);
  }, [siteDropDownDetails]);

  const soilPropertyDataCategories = Object.keys(filterSoilPropertyData.sand).filter((key) =>
    key.endsWith("cm")
  );

  console.log('filterSoilPropertyData', filterSoilPropertyData)
  // Create series data for each soc object
  const series = Object.entries(filterSoilPropertyData).map(([key, data]) => ({
    name: key,
    data: soilPropertyDataCategories.map((category) => (data as Record<string, number>)[category]),
  }));

  const soilDataCategories = Object.keys(filterSoilData).filter((key) =>
    key.endsWith("cm"))

  const series2 = [
    {
      name: '', // Series name
      data: soilDataCategories.map((category) => filterSoilData[category] || 0), // Map depth levels to their values
      color: "#45C8FF", // Default color for the series
    },
  ];

  const options1 = {
    chart: {
      type: "column",
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: soilPropertyDataCategories,
      title: {
        text: "Depth Levels (cm)",
      },
    },
    yAxis: {
      title: {
        text: 'Percentage (%)',
      },
      labels: {
        formatter: function (this: Highcharts.AxisLabelsFormatterContextObject): string {
          return this.value + '%';
        },
      },
    },
    legend: {
      enabled: true,
      labelFormatter: function (this: Highcharts.Point): string {
        // Accessing the name property from the point
        const legendName = this.name?.replace(/_/g, ' ') ?? '';
        return legendName.charAt(0).toUpperCase() + legendName.slice(1);
      },
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
        // Custom tooltip content using the added `tooltipValue`
        const depthLevel = this.point.category; // Category from xAxis
        const seriesName = this.series.name.charAt(0).toUpperCase() + this.series.name.slice(1); // Series name
        const percentage = this.y?.toFixed(2);
        return `<b>${seriesName}</b><br><b>Depth Level</b>: ${depthLevel}<br><b>Percentage:</b>${percentage}%`;
      },
    },
    plotOptions: {
      series: {
        grouping: true,
        borderWidth: 0,
      },
    },
    series,
  };

  const options2 = {
    chart: {
      type: "column",
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: soilDataCategories, // Use extracted depth levels
      title: {
        text: "Depth Levels (cm)",
      },
    },
    yAxis: {
      title: {
        text: "tc/ha", // Updated to match the unit from JSON
      },
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
        return `
          <b>Depth:</b> ${this.x}<br/>
          <b>SOC:</b> ${(this.y as number).toFixed(2)} tc/ha
        `;
      },
    },
    series: series2, // Correctly assign the series
  };

  let transformedData: { name: string; value1: number; value2: number }[] = [];
  if (filterTransitionData &&
    typeof filterTransitionData === "object" &&
    Object.keys(filterTransitionData).length > 0 &&
    filterTransitionData[2000] &&
    filterTransitionData[2022]) {
    transformedData = Object.keys(filterTransitionData[2000])?.map((key) => ({
      name: key,
      value1: !isNaN(Number(filterTransitionData[2000][key]))
        ? Number(filterTransitionData[2000][key].toFixed(2))
        : 0, // 2000 value
      value2: !isNaN(Number(filterTransitionData[2022][key]))
        ? Number(filterTransitionData[2022][key].toFixed(2))
        : 0, // 2022 value
    }));
  }

  const transformedSurfaceWaterData = Object.keys(filterWaterData)
    .filter((key) => key !== "unit") // Exclude the unit key
    .map((key) => ({
      name: key,
      value1: Number(filterWaterData[key].toFixed(2)),
    }));

  useEffect(() => {
    if (!filterTimeSeriesData) return;
    const categories = Object.keys(filterTimeSeriesData).filter((key) => !isNaN(Number(key)));
    setCategories(categories);
    const firstYear = categories[0];
    if (!firstYear) return;

    const seriesNames = Object.keys(filterTimeSeriesData[firstYear] || {});
    const seriesData = seriesNames.map((name) => ({
      name,
      data: categories.map((year) => filterTimeSeriesData[year]?.[name] || 0),
    }));

    setSeriesData(seriesData);
  }, [filterTimeSeriesData]);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scrolling
    });
  }, []);
  const config = {
    chart: {
      type: 'area',
    },
    title: {
      text: null,
    },
    xAxis: {
      categories: categories,
      title: {
        text: 'Year',
      },
    },
    yAxis: {
      title: {
        text: 'Hectares (ha)',
      },
      labels: {
        formatter: function (this: Highcharts.AxisLabelsFormatterContextObject): string {
          return `${this.value}`; // Convert value to string
        },
      },
    },
    tooltip: {
      shared: true,
      formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
        return `<b>${this.x}</b><br/>` +
          this.points
            ?.map(
              (point) =>
                `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: <b>${point.y?.toFixed()} ha</b>`
            )
            .join("<br/>");
      },
    },
    plotOptions: {
      area: {
        stacking: 'normal',
        lineColor: '#fff',
        lineWidth: 1,
        marker: {
          enabled: false,
        },
      },
    },
    series: seriesData,
  };

  const carbonAnalysisData = [
    {
      label: "Total Above Ground Biomass", value: siteDropDownDetails?.agb + " " + siteDropDownDetails?.agb_unit,
      xs: 4, sm: 2
    },
    {
      label: "Total Mean Above Ground Biomass", value: siteDropDownDetails?.mean_agb + " " + siteDropDownDetails?.mean_agb_unit,
      xs: 4, sm: 3
    },
    {
      label: "Total Cstock Above Ground Biomass", value: siteDropDownDetails?.cstock_agb + " " + siteDropDownDetails?.cstock_agb_unit,
      xs: 4, sm: 3
    },
    {
      label: "Total Mean Cstock Above Ground Biomass", value: siteDropDownDetails?.mean_cstock_agb + " " + siteDropDownDetails?.mean_cstock_agb_unit,
      xs: 4, sm: 2
    },
    {
      label: "Total Below Ground Biomass", value: siteDropDownDetails?.bgb + " " + siteDropDownDetails?.bgb_unit,
      xs: 4, sm: 2
    },
    {
      label: "Total Mean Below Ground Biomass", value: siteDropDownDetails?.mean_bgb + " " + siteDropDownDetails?.mean_bgb_unit,
      xs: 4, sm: 3
    },
    {
      label: "Total Cstock Below Ground Biomass", value: siteDropDownDetails?.cstock_bgb + " " + siteDropDownDetails?.cstock_bgb_unit,
      xs: 4, sm: 3
    },
    {
      label: "Total Mean Cstock Below Ground Biomass", value: siteDropDownDetails?.mean_cstock_bgb + " " + siteDropDownDetails?.mean_cstock_bgb_unit,
      xs: 4, sm: 2
    },
  ]

  return (
    <Box sx={{ mt: 4 }}>
      <Box className="bio-map">
        <DMapAnalysis />
      </Box>

      <SiteDetailCard siteTitle={siteDropDownDetails?.site_name} siteDetail={siteDropDownDetails?.type} />
      <Box sx={{ mb: 3 }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <SiteCard
              title={'Area Covered'}
              amount={`${siteDropDownDetails.total_area} ${siteDropDownDetails.total_area_unit}`}
              icon={SiteArea} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <SiteCard
              title={'Total Plantation Area'}
              amount={`${siteDropDownDetails?.total_plantation_area} ${siteDropDownDetails?.total_plantation_area_unit}`}
              icon={SitePlantation} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <SiteCard
              title={'Total Planted Trees'}
              amount={siteDropDownDetails?.total_planted_trees}
              icon={SiteTree} />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{
            boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}>
            <Typography
              component="div"
              sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
            >
              {'Land Use Land Cover (in ha)'}
            </Typography>
            <Box className='divider' sx={{ m: 2 }} />
            {categories.length > 0 && seriesData.length > 0 && (
              <HighchartsReact highcharts={Highcharts} options={config} />)}
          </Card>
        </Grid>
        {transformedData.length ?
          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'pie'} chartTitle={'Land Cover Area Distribution - 2000 (in ha)'} data={transformedData.map((item) => ({ name: item.name, value1: item.value1 }))} seriesValue1='Area' />
          </Grid> : null}
        {transformedData.length ?
          <Grid size={{ xs: 6 }}>
            <ChartComponent chartType={'pie'} chartTitle={'Land Cover Area Distribution - 2022 (in ha)'} data={transformedData.map((item) => ({ name: item.name, value1: item.value2 }))} seriesValue1='Area' />
          </Grid>
          : null}
        <Grid size={{ xs: 12 }}>
          <ChartComponent chartType={'pie'} chartTitle={'Surface Water Transition (1984-2021) (in ha)'} data={transformedSurfaceWaterData} seriesValue1='Area' />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card sx={{
            boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}>
            <Typography
              component="div"
              sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
            >
              {'Soil Properties'}
            </Typography>
            <Box className='divider' sx={{ m: 2 }} />
            <HighchartsReact
              highcharts={Highcharts}
              options={options1}
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Card sx={{
            boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
            borderRadius: '8px',
            backgroundColor: '#fff',
          }}>
            <Typography
              component="div"
              sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
            >
              {'Soil Organic Carbon (SOC)'}
            </Typography>
            <Box className='divider' sx={{ m: 2 }} />
            <HighchartsReact
              highcharts={Highcharts}
              options={options2}
            />
          </Card>
        </Grid>
      </Grid>

      <Box>
        <Typography sx={{ fontSize: "24px", fontWeight: 600, color: "#151E15" }}>{'Biomass & Cstock'}</Typography>
      </Box>
      <Box className='bio-map' sx={{ mb: 3 }}>
        <DMapCANew />
      </Box>
      <Box className='project-box'>
        <Grid container>
          <CreditCard data={carbonAnalysisData} />
        </Grid>
      </Box>
    </Box>
  )
}

export default CarbonAnalysisDetails;