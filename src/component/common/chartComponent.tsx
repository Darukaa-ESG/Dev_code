import React, { FC } from 'react';
import { Box, Card, Typography } from '@mui/material';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
interface GenericChartProps {
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'donut' | 'column' | 'stacked';
  chartTitle: string;
  title?: string;
  yTitle?: string;
  seriesValue1?: string;
  seriesValue2?: string;
  data: { name: string; value1: number; value2?: number; date?: string; }[]; // value2 is optional
}
export const ChartComponent: FC<GenericChartProps> = ({ chartType, data, chartTitle, title, yTitle: xTitle, seriesValue1, seriesValue2 }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              title: { text: null },
              credits: { enabled: false },
              xAxis: {
                categories: data.map((item) => item.name),
                title: {
                  text: xTitle
                }
              },
              yAxis: {
                title: {
                  text: title,
                },

              },
              series: [
                {
                  name: seriesValue1,
                  data: data.map((item) => item.value1),
                  color: '#1E90FF',
                },
              ],
              legend: {
                enabled: false, // Disables the legend
              },
            }}
          />
        );
      case 'area':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              title: { text: null },
              credits: { enabled: false },
              chart: {
                type: 'area',
              },
              xAxis: {
                categories: data.map((item) => item.name),
                title: {
                  text: xTitle
                }
              },
              yAxis: {
                title: {
                  text: 'Values',
                },
              },
              series: [
                {
                  name: 'Value 1',
                  data: data.map((item) => item.value1),
                  fillColor: {
                    linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1,
                    },
                    stops: [
                      [0, '#99F4D5'], // Solid color at the top
                      [1, 'rgba(153, 244, 213, 0)'], // Transparent at the bottom
                    ],
                  },
                  lineColor: '#00E396', // Outline color
                  lineWidth: 3, // Line thickness
                  fillOpacity: 0.5, // Fill opacity for the area
                },
                {
                  name: 'seriesValue2',
                  data: data.map((item) => item.value2),
                  fillColor: {
                    linearGradient: {
                      x1: 0,
                      y1: 0,
                      x2: 0,
                      y2: 1,
                    },
                    stops: [
                      [0, '#2E93FA'], // Solid color at the top
                      [1, 'rgba(153, 244, 213, 0)'], // Transparent at the bottom
                    ],
                  },
                  lineColor: '#2E93FA', // Outline color
                  lineWidth: 3, // Line thickness
                  fillOpacity: 0.5, // Fill opacity for the area
                },
              ],
              tooltip: {
                shared: true, // Shared tooltip for multiple series
                valueSuffix: ' units', // Unit suffix for values
              },
              plotOptions: {
                area: {
                  pointStart: 1940,
                  marker: {
                    enabled: false, // Disable markers by default
                    states: {
                      hover: {
                        enabled: true, // Enable markers only on hover
                        radius: 4, // Set radius for hover
                      }
                    }
                  }
                }
              },
              legend: {
                enabled: false, // Disables the legend
              },
            }}
          />
        );
      case 'pie':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'pie',
              },
              title: { text: null },
              credits: { enabled: false },
              series: [
                {
                  name: seriesValue1,
                  data: data.map((item) => ({
                    name: item.name,
                    y: item.value1,
                  })),
                  colorByPoint: true,
                },
              ],
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                    enabled: false,
                    format: `
          Area:<b>{point.y:.2f}</b><br/>
          Percentage: <b>{point.percentage:.1f}%</b>`,
                  },
                  showInLegend: true
                },
              },
              tooltip: {
                pointFormat: `
                 Area: <b>{point.y:.2f} ha</b><br/>
                  Percentage: <b>{point.percentage:.1f}%</b>`,
              },
            }}
          />
        );
      case 'bar':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'column',
              },
              title: { text: null },
              credits: { enabled: false },
              xAxis: {
                categories: data.map((item) => item.name),
                title: {
                  text: xTitle
                }
              },
              yAxis: {
                title: {
                  text: title,
                },
              },
              series: [
                {
                  name: seriesValue1,
                  data: data.map((item) => item.value1),
                  color: '#7B68EE',
                },
                {
                  name: seriesValue2,
                  data: data.map((item) => item.value2 || 0),
                  color: '#FFA07A',
                },
              ],
              tooltip: {
                shared: true,
                valueSuffix: ' units',
              },
              legend: {
                enabled: false, // Disables the legend
              },
            }}
          />
        );
      case 'column':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'column',
                animation: false,
              },
              title: { text: null },
              credits: { enabled: false },
              xAxis: {
                categories: data.map((item) => item.name),
                title: {
                  text: xTitle
                }
              },
              yAxis: {
                title: {
                  text: title,
                },
              },
              series: [
                {
                  name: seriesValue1,
                  data: data.map((item) => item.value1),
                  color: '#7B68EE',
                },
              ],
              tooltip: {
                shared: true,
                valueSuffix: ' units',
              },
              legend: {
                enabled: false, // Disables the legend
              },
            }}
          />
        );
      case 'donut':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'pie',
              },
              title: { text: null },
              credits: { enabled: false },
              series: [
                {
                  name: seriesValue1,
                  data: data.map((item) => ({
                    name: item.name,
                    y: item.value1,
                  })),
                  colorByPoint: true,
                  innerSize: '50%', // This creates the donut effect by having an inner radius
                },
              ],
              tooltip: {
                pointFormat: `
          No.of Credits: <b>{point.y}</b><br/>
          Percentage: <b>{point.percentage:.1f}%</b>
          `,
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
                      color: '#ffffff', // Adjust text color for better visibility
                      fontSize: '14px', // Increase font size
                      fontWeight: 'bold',
                    },
                  },
                  showInLegend: true
                },
              },
            }}
          />
        );
      case 'stacked':
        return (
          <HighchartsReact
            highcharts={Highcharts}
            options={{
              chart: {
                type: 'area',
              },
              title: {
                text: chartTitle,
              },
              credits: {
                enabled: false,
              },
              xAxis: {
                categories: data.map((item) => item.name),
                tickmarkPlacement: 'on',
                title: {
                  enabled: false,
                },
              },
              yAxis: {
                title: {
                  text: title,
                },
                stackLabels: {
                  enabled: true,
                  style: {
                    fontWeight: 'bold',
                    color: 'gray',
                  },
                },
              },
              tooltip: {
                shared: true,
                valueSuffix: ' units',
              },
              plotOptions: {
                area: {
                  stacking: 'normal',
                  lineColor: '#666666',
                  lineWidth: 1,
                  marker: {
                    lineWidth: 1,
                    lineColor: '#666666',
                  },
                },
              },
              series: [
                {
                  name: seriesValue1,
                  data: data.map((item) => item.value1),
                  color: '#1E90FF',
                },
              ],
              legend: {
                enabled: false, // Disables the legend
              },
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card sx={{
      boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
      borderRadius: '8px',
      backgroundColor: '#fff',
    }}>
      {chartTitle?.trim() && (
        <Typography
          component="div"
          sx={{ textAlign: "left", fontSize: "16px", fontWeight: 600, color: '#151E15', p: "16px" }}
        >
          {chartTitle}
        </Typography>
      )}
      <Box className='divider' />
      <Box padding='16px'>
        {renderChart()}
      </Box>
    </Card>
  );
};
