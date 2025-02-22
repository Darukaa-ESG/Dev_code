import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid2'
import { Box } from '@mui/material'
import Highcharts from 'highcharts';
import HighchartsMore from "highcharts/highcharts-more";
import ProjectListData from '../../../../db.json';
import { ChartComponent } from '../../../common/chartComponent';
import { CreditData } from '../../../../Interface/Index';
import { CreditCard } from '../../../common/cardComponent';

HighchartsMore(Highcharts);
export interface ChartConfig {
  year: string;
  options: Highcharts.Options;
}

const CarbonCredit = () => {
  const [projectSite] = useState(ProjectListData.CarbonCredit);
  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([]);

  const filterCredit: CreditData = projectSite[0].credits;
  const bufferUnits = filterCredit.buffer_units;
  const estimatedIssued = filterCredit.estimated_issued_vcu;
  const estimatedRetired = filterCredit.estimated_retired_vcu;

  const chartData = Object.keys(estimatedIssued)
    .filter((key) => key !== "unit")
    .map((year) => ({
      name: year,
      value1: estimatedIssued[year] || 0,
      value2: estimatedRetired[year] || 0,
    }));

  const chartDataBuffer = Object.keys(bufferUnits)
    .filter((key) => key !== "unit")
    .map((year) => ({
      name: year,
      value1: bufferUnits[year] || 0,
      value2: estimatedIssued[year] || 0,
    }));

  useEffect(() => {
    const years = Object.keys(bufferUnits).filter((year) => year !== "unit");
    const configs: ChartConfig[] = years.map((year) => ({
      year,
      options: {
        chart: { type: "pie" },
        title: { text: `Year ${year}` },
        plotOptions: {
          pie: {
            innerSize: "50%", // Donut chart
            dataLabels: { enabled: true, format: "<b>{point.name}</b>: {point.y}" },
          },
        },
        series: [
          {
            type: "pie",
            name: "Credits",
            colorByPoint: true,
            data: [
              { name: "Buffer Units", y: bufferUnits[year] || 0 },
              { name: "Estimated Issued", y: estimatedIssued[year] || 0 },
            ],
          },
        ],
      },
    }));

    setChartConfigs(configs);
  }, [bufferUnits, estimatedIssued]);

  const CreditCardData = [
    {
      label: 'Total Estimated VCUs',
      value: projectSite[0].credits.total_estimated_issued_vcu,
      xs:4,
      sm:2.6,
    },
    {
      label: 'Average Price Per VCU',
      value: projectSite[0].credits.average_price_per_vcu,
      xs:4,
      sm:2.6,
    },
    {
      label: 'Total VCUs Retired',
      value: projectSite[0].credits.total_vcu_retired,
      xs:4,
      sm:2.6,
    },
    {
      label: 'VCUs available for Sale',
      value: projectSite[0].credits.vcu_available_for_sale,
      xs:4,
      sm:2.6,
    }
  ]

  return (
    <Box sx={{ mt: 5 }}>
      <Box
        sx={{
          maxHeight: '400px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          padding: '10px',
          backgroundColor: "#fff",
          margin: "15px 1px",
          borderRadius: "8px",
          boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
        }}
      >
        <CreditCard data={CreditCardData} />
      </Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <ChartComponent
            chartType="line"
            chartTitle="Estimated VCUs Per Year"
            data={Object.keys(filterCredit.vcu || {}).map((key) => ({
              name: key,
              value1: Number(filterCredit.vcu[key as keyof typeof filterCredit.vcu]) || 0,
            }))}
            title="VCUs"
            seriesValue1="VCUs"
            yTitle='Year'
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ChartComponent chartType={'bar'} chartTitle={'Estimated VCUs / Buffer Unit'} data={chartDataBuffer} title='VCUs' seriesValue1='Buffer Unit'
            seriesValue2='Estimated VCUs' yTitle='Year' />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <ChartComponent chartType={'bar'} chartTitle={'Estimated VCUs /Retired'} data={chartData} title='VCUs' seriesValue1='Estimated VCUs'
            seriesValue2='Estimated Retired VCUs' yTitle='Year' />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CarbonCredit;