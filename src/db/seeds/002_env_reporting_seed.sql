-- 002_environmental_reporting_seed.sql
-- Seed environmental reporting tables with sample data

-- Insert a sample project-level environmental reporting record for project_id = 1
INSERT INTO environmental_reporting_projects (
    project_id,
    total_area,
    number_of_sites,
    project_site_map,
    overall_risk_score,
    overall_risk_category,
    value_at_risk,
    chronic_risks,
    acute_risks,
    climate_projections,
    created_at,
    updated_at
) VALUES (
    1,
    160.55,
    3,
    'path_to_shape_file',
    6.7,
    'Moderate',
    '6.4M USD',
    '{"Flood_risk": "Moderately_High", "Sea Sea_level_rise_risk": "Moderately_High", "Extreme_heat_risk": "Low", "Drought_risk": "Low"}'::jsonb,
    '{"Extreme_precipitation_risk": "High", "Wildfire_risk": "Moderate", "Extreme_cold_risk": "Low", "Landslide_risk": "Low", "Tropical_cyclone_risk": "High"}'::jsonb,
    '{
        "Optimistic_Scenario": {
            "Near_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.2%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-3", "unit": "days"},
                "Cyclone_Frequency": {"change": "+2", "unit": "cyclones"}
            },
            "Mid_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.4%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-6", "unit": "days"},
                "Cyclone_Frequency": {"change": "+4", "unit": "cyclones"}
            },
            "Long_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.8%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-10", "unit": "days"},
                "Cyclone_Frequency": {"change": "+6", "unit": "cyclones"}
            }
        },
        "Intermediate_Scenario": {
            "Near_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.5%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-4", "unit": "days"},
                "Cyclone_Frequency": {"change": "+3", "unit": "cyclones"}
            },
            "Mid_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.8%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-8", "unit": "days"},
                "Cyclone_Frequency": {"change": "+5", "unit": "cyclones"}
            },
            "Long_Term": {
                "Sea_Level_Rise": {"percentage_change": "+1.2%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-12", "unit": "days"},
                "Cyclone_Frequency": {"change": "+7", "unit": "cyclones"}
            }
        },
        "Extreme_Scenario": {
            "Near_Term": {
                "Sea_Level_Rise": {"percentage_change": "+1.0%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-5", "unit": "days"},
                "Cyclone_Frequency": {"change": "+4", "unit": "cyclones"}
            },
            "Mid_Term": {
                "Sea_Level_Rise": {"percentage_change": "+1.5%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-10", "unit": "days"},
                "Cyclone_Frequency": {"change": "+6", "unit": "cyclones"}
            },
            "Long_Term": {
                "Sea_Level_Rise": {"percentage_change": "+2.0%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-15", "unit": "days"},
                "Cyclone_Frequency": {"change": "+8", "unit": "cyclones"}
            }
        }
    }'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert a sample site-level environmental reporting record for the Tipligheri site (site_id = 1)
INSERT INTO environmental_reporting_sites (
    project_id,
    site_id,
    site_name,
    type,
    area,
    path,
    site_risk_score,
    site_risk_category,
    chronic_risks,
    acute_risks,
    climate_projections,
    created_at,
    updated_at
) VALUES (
    1,
    1,
    'Tipligheri',
    'Restoration',
    68.83,
    'path_to_shape_file',
    6.5,
    'Moderate',
    '{"Flood_risk": "Moderately_High", "Drought_risk": "Low", "Extreme_heat_risk": "Low", "Sea Sea_level_rise_risk": "Moderately_High"}'::jsonb,
    '{"Extreme_precipitation_risk": "High", "Wildfire_risk": "Moderate", "Extreme_cold_risk": "Low", "Landslide_risk": "Low", "Tropical_cyclone_risk": "High"}'::jsonb,
    '{
        "Optimistic_Scenario": {
            "Near_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.2%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-3", "unit": "days"},
                "Cyclone_Frequency": {"change": "+2", "unit": "cyclones"}
            },
            "Mid_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.4%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-6", "unit": "days"},
                "Cyclone_Frequency": {"change": "+4", "unit": "cyclones"}
            },
            "Long_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.8%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-10", "unit": "days"},
                "Cyclone_Frequency": {"change": "+6", "unit": "cyclones"}
            }
        }
    }'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert a sample site-level environmental reporting record for the Maipith site (site_id = 2)
INSERT INTO environmental_reporting_sites (
    project_id,
    site_id,
    site_name,
    type,
    area,
    path,
    site_risk_score,
    site_risk_category,
    chronic_risks,
    acute_risks,
    climate_projections,
    created_at,
    updated_at
) VALUES (
    1,
    2,
    'Maipith',
    'Restoration',
    25.68,
    'path_to_shape_file',
    6.9,
    'Moderate',
    '{"Flood_risk": "Moderately_High", "Drought_risk": "Low", "Extreme_heat_risk": "Low", "Sea Sea_level_rise_risk": "Moderately_High"}'::jsonb,
    '{"Extreme_precipitation_risk": "High", "Wildfire_risk": "Moderate", "Extreme_cold_risk": "Low", "Landslide_risk": "Low", "Tropical_cyclone_risk": "High"}'::jsonb,
    '{
        "Optimistic_Scenario": {
            "Near_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.2%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-2", "unit": "days"},
                "Cyclone_Frequency": {"change": "+1", "unit": "cyclones"}
            },
            "Mid_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.4%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-4", "unit": "days"},
                "Cyclone_Frequency": {"change": "+2", "unit": "cyclones"}
            },
            "Long_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.8%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-6", "unit": "days"},
                "Cyclone_Frequency": {"change": "+3", "unit": "cyclones"}
            }
        }
    }'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Insert a sample site-level environmental reporting record for the Dwariknagar site (site_id = 3)
INSERT INTO environmental_reporting_sites (
    project_id,
    site_id,
    site_name,
    type,
    area,
    path,
    site_risk_score,
    site_risk_category,
    chronic_risks,
    acute_risks,
    climate_projections,
    created_at,
    updated_at
) VALUES (
    1,
    3,
    'Dwariknagar',
    'Conservation',
    66.04,
    'path_to_shape_file',
    6.3,
    'Moderate',
    '{"Flood_risk": "Moderately_High", "Drought_risk": "Low", "Extreme_heat_risk": "Low", "Sea Sea_level_rise_risk": "Moderately_High"}'::jsonb,
    '{"Extreme_precipitation_risk": "High", "Wildfire_risk": "Moderate", "Extreme_cold_risk": "Low", "Landslide_risk": "Low", "Tropical_cyclone_risk": "High"}'::jsonb,
    '{
        "Optimistic_Scenario": {
            "Near_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.2%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-3", "unit": "days"},
                "Cyclone_Frequency": {"change": "+2", "unit": "cyclones"}
            },
            "Mid_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.4%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-6", "unit": "days"},
                "Cyclone_Frequency": {"change": "+4", "unit": "cyclones"}
            },
            "Long_Term": {
                "Sea_Level_Rise": {"percentage_change": "+0.8%", "unit": "m"},
                "Consecutive_Dry_Days": {"change": "-10", "unit": "days"},
                "Cyclone_Frequency": {"change": "+6", "unit": "cyclones"}
            }
        }
    }'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
