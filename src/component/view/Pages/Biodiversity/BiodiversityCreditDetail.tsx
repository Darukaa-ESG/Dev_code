import React, { useState } from 'react'
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid2'
import { ChartComponent } from '../../../common/chartComponent';
import ProjectListData from '../../../../db.json';
import { CreditCard } from '../../../common/cardComponent';

const BiodiversityCreditDetail = () => {
  const [projectSite] = useState(ProjectListData.ProjectSite);
  const filterSpeciesData = projectSite[0][0].credits
  const chartData1 = [
    { name: 'July 2023', value1: filterSpeciesData[0]?.historical_credits_retirement[0]["July 2023"] },
    { name: 'October 2023', value1: filterSpeciesData[0]?.historical_credits_retirement[0]["October 2023"] },
    { name: 'December 2023', value1: filterSpeciesData[0]?.historical_credits_retirement[0]["December 2023"] },
    { name: 'February 2024', value1: filterSpeciesData[0]?.historical_credits_retirement[0]["February 2024"] },
    { name: 'August 2024', value1: filterSpeciesData[0]?.historical_credits_retirement[0]["August 2024"] },
  ];

  const chartData2 = [
    { name: 'Retired Credits', value1: filterSpeciesData[0]["overall_issued/retired"][0].retired },
    { name: 'Issued Credits', value1: filterSpeciesData[0]["overall_issued/retired"][0].issued },
  ]
  const creditCardData = [
    { label:'Total Credits', value: filterSpeciesData[0]?.total_credits_over_crediting_period, xs:4,sm:2.6 },
    { label:'Average Price Per Credit', value: filterSpeciesData[0]?.average_price_per_credit, xs:4,sm:2.6 },
    { label:'Credits Available For Sale', value: filterSpeciesData[0]?.credits_available_for_sale, xs:4,sm:2.6 },
    { label:'Credits Retired', value: filterSpeciesData[0]?.credit_retired, xs:4,sm:2.6 },
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
        <CreditCard data={creditCardData}/>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <ChartComponent chartType={'column'} chartTitle={'Historical Credits Retirement'} data={chartData1} title='Credit Retired' seriesValue1='Credits' yTitle='Month Year' />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <ChartComponent chartType={'donut'} chartTitle={'Overall Issued/Retired Credits'} data={chartData2} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default BiodiversityCreditDetail