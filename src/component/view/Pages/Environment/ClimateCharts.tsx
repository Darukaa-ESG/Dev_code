import React from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import SolidGauge from "highcharts/modules/solid-gauge";
import HighchartsMore from 'highcharts/highcharts-more';
// Initialize Highcharts More for gauge charts
HighchartsMore(Highcharts);
SolidGauge(Highcharts);

type RiskLevel = "High" | "Moderate" | "Low" | "ModerateHigh" | "ModerateLow";
export const riskLevelMapping: Record<string, number> = {
    "Low": 25,
    "Moderately_Low": 40,
    "Moderate": 50,
    "Moderately_High": 75,
    "High": 100,
};

export const getRiskValue = (riskLevel: string): number => {
    return riskLevelMapping[riskLevel] || 0; // Default to 0 if the level isn't found
};
export const SolidGaugeChart = ({
    title,
    value,
    riskLevelTitle,
    onClick,
    isClickable = false,
}: {
    title: string;
    value: number;
    riskLevel: RiskLevel;
    riskLevelTitle: string;
    onClick?: () => void;
    isClickable?: boolean;
}) => {
    const riskColors: Record<RiskLevel, string> = {
        High: "#ff4d4f",         // Green
        ModerateHigh: "#ffc107", // Amber
        Moderate: "#ffca4b",     // Orange
        ModerateLow: "#ff6f61",  // Soft Red
        Low: "#52c41a",          // Bright Red
    };

    const options = {
        chart: {
            type: "solidgauge",
            height: 170,
            events: isClickable
                ? {
                    click: function () {
                        if (onClick) onClick(); // Call the provided onClick function
                    },
                }
                : undefined, // Only add click event if isClickable is true
            style: {
                cursor: isClickable ? "pointer" : "default", // Change cursor to pointer if clickable
            },
        },
        title: {
            text: title,
            style: {
                color: "#666666",
                fontSize: "15px",
                fontWeight: "600",
            },
            y: 15
        },
        pane: {
            center: ["50%", "50%"],
            size: "100%",
            startAngle: -90,
            endAngle: 90,
            background: {
                backgroundColor: "#EEE",
                innerRadius: "70%",
                outerRadius: "100%",
                shape: "arc",
            },
        },
        tooltip: {
            enabled: false, // Disable tooltip
        },
        yAxis: {
            min: 0,
            max: 100,
            stops: [
                [0.33, riskColors.Low],
                [0.66, riskColors.Moderate],
                [1, riskColors.High],
            ],
            lineWidth: 0,
            tickWidth: 0,
            minorTickInterval: null,
            tickAmount: 0,
            title: {
                text: riskLevelTitle,
                align: "middle",
                style: {
                    color: "#666666",
                    fontSize: "12px",
                    fontWeight: "600",

                },
                y: 50, // Hide the title
            },
            labels: {
                enabled: false, // Disable the labels on the gauge
            },
        },
        series: [
            {
                name: "Risk Level",
                data: [value],
                dataLabels: {
                    enabled: false, // Completely hide the data labels
                },
            },
        ],
        credits: {
            enabled: false, // Disable the Highcharts branding
        },
    };

    return <HighchartsReact highcharts={Highcharts} options={options} />;
};
