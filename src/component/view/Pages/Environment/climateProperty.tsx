import React, { useState, useEffect } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

type TermData = {
  percentage_change: string;
  unit: string;
};

type TimeFrame = {
  Sea_Level_Rise: TermData;
  Total_Precipitation: TermData;
  Mean_Temperature: TermData;
  Maximum_1_Day_Precipitation: TermData;
  Storm_Surge_Height:TermData;
};

type ScenarioData = {
  Near_Term: TimeFrame;
  Mid_Term: TimeFrame;
  Long_Term: TimeFrame;
};

type DataStructure = {
  Optimistic_Scenario: ScenarioData;
  Intermediate_Scenario: ScenarioData;
  Extreme_Scenario: ScenarioData;
};

const data: DataStructure = {
  Optimistic_Scenario: {
    Near_Term: {
      Sea_Level_Rise: { percentage_change: "+0.2%", unit: "m" },
      Total_Precipitation: { percentage_change: "+1.5%", unit: "%" },
      Mean_Temperature: { percentage_change: "+0.3%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+10%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+10%",unit: "m"}
    },
    Mid_Term: {
      Sea_Level_Rise: { percentage_change: "+0.4%", unit: "m" },
      Total_Precipitation: { percentage_change: "+3.0%", unit: "%" },
      Mean_Temperature: { percentage_change: "+0.6%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+20%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+15%",unit: "m"}

    },
    Long_Term: {
      Sea_Level_Rise: { percentage_change: "+0.8%", unit: "m" },
      Total_Precipitation: { percentage_change: "+5.0%", unit: "%" },
      Mean_Temperature: { percentage_change: "+1.0%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+30%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+25%",unit: "m"}

    },
  },
  Intermediate_Scenario: {
    Near_Term: {
      Sea_Level_Rise: { percentage_change: "+0.2%", unit: "m" },
      Total_Precipitation: { percentage_change: "+1.5%", unit: "%" },
      Mean_Temperature: { percentage_change: "+0.3%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+10%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+10%",unit: "m"}

    },
    Mid_Term: {
      Sea_Level_Rise: { percentage_change: "+0.4%", unit: "m" },
      Total_Precipitation: { percentage_change: "+3.0%", unit: "%" },
      Mean_Temperature: { percentage_change: "+0.6%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+20%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+20%",unit: "m"}

    },
    Long_Term: {
      Sea_Level_Rise: { percentage_change: "+0.8%", unit: "m" },
      Total_Precipitation: { percentage_change: "+5.0%", unit: "%" },
      Mean_Temperature: { percentage_change: "+1.0%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+30%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+30%",unit: "m"}

    },
  },
  Extreme_Scenario: {
    Near_Term: {
      Sea_Level_Rise: { percentage_change: "+0.2%", unit: "m" },
      Total_Precipitation: { percentage_change: "+1.5%", unit: "%" },
      Mean_Temperature: { percentage_change: "+0.3%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+10%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+15%",unit: "m"}

    },
    Mid_Term: {
      Sea_Level_Rise: { percentage_change: "+0.4%", unit: "m" },
      Total_Precipitation: { percentage_change: "+3.0%", unit: "%" },
      Mean_Temperature: { percentage_change: "+0.6%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+20%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+25%",unit: "m"}

    },
    Long_Term: {
      Sea_Level_Rise: { percentage_change: "+0.8%", unit: "m" },
      Total_Precipitation: { percentage_change: "+5.0%", unit: "%" },
      Mean_Temperature: { percentage_change: "+1.0%", unit: "°C" },
      Maximum_1_Day_Precipitation: { percentage_change: "+30%", unit: "mm" },
      Storm_Surge_Height: {  percentage_change: "+40%",unit: "m"}

    },
  },
};

const ChartProjectionComponent = () => {
  const [scenario, setScenario] = useState<keyof DataStructure>("Optimistic_Scenario");
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // Extract data for the selected scenario
    const scenarioData = data[scenario];
    const terms = Object.keys(scenarioData.Near_Term) as Array< keyof TimeFrame>;
    const formattedTerms = terms.map((term) => term.replace(/_/g, " "));
    const nearTermValues = terms.map((term) =>
      parseFloat(scenarioData.Near_Term[term].percentage_change.replace("%", ""))
    );
    const midTermValues = terms.map((term) =>
      parseFloat(scenarioData.Mid_Term[term].percentage_change.replace("%", ""))
    );
    const longTermValues = terms.map((term) =>
      parseFloat(scenarioData.Long_Term[term].percentage_change.replace("%", ""))
    );
    // Set Highcharts options
    setChartOptions({
      title: { text: `${scenario.replace(/_/g, ' ') ?? ''} Trends` },
      xAxis: { categories: formattedTerms ,title:{  text:  `${scenario.replace(/_/g, ' ') ?? ''} Trends` }},
      yAxis: { title: { text: "Percentage Change (%)" } },
      series: [
        { name: "Near Term", data: nearTermValues },
        { name: "Mid Term", data: midTermValues },
        { name: "Long Term", data: longTermValues },
      ],
    });
  }, [scenario]);

  return (
    <Box sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <Typography
            component="div"
            sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
          >{'Climate Projections'}
          </Typography>
        </Box>
        <Box>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Select Scenario</InputLabel>
            <Select
              label="Select Scenario"
              value={scenario}
              onChange={(e:SelectChangeEvent) => setScenario(e.target.value as keyof DataStructure)}
              sx={{mr:1}}
            >
              <MenuItem value="Optimistic_Scenario">Optimistic Scenario</MenuItem>
              <MenuItem value="Intermediate_Scenario">Intermediate Scenario</MenuItem>
              <MenuItem value="Extreme_Scenario">Extreme Scenario</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box className='divider' sx={{ m: 2 }} />
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </Box>
  );
};

export default ChartProjectionComponent;
