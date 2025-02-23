-- 001_seed.sql
-- This script truncates all tables and seeds them with data.

-- Truncate all tables and restart identities so that IDs start from 1
TRUNCATE projects, sites, carbon_project_metrics, carbon_site_metrics, carbon_credits, biodiversity_credits RESTART IDENTITY CASCADE;

------------------------------
-- Insert project data (project_id will be 1)
------------------------------
INSERT INTO projects (
    name, project_identifier, project_start_date, project_end_date, 
    status, country, description, project_type, total_area,
    emission_reduction_unit, total_emission_reduction, avg_annual_emission_reduction,
    crediting_period, project_developer, registry, image_2010, image_2015,
    image_2020, image_2024, sdg, created_at, updated_at
) VALUES (
    'Mangrove Plantation Initiative in Sundarbans, India',
    'N/A',
    '2024-01-01',
    '2044-12-31',
    'Under development',
    'India',
    'The Sundarbans Mangrove Forest, recognized as a UNESCO World Heritage Site. This project focuses on restoration, community engagement, and enhanced carbon sequestration.',
    'ARR/WRC',
    567,
    'tCO2e',
    259305.1,
    12965.2,
    '20 years',
    'South Asian Forum of Environment',
    'Verra',
    'path_to_img',
    'path_to_img',
    'path_to_img_3',
    'path_to_img_4',
    '["sdg1.png", "sdg2.png", "sdg5.png", "sdg8.png", "sdg13.png", "sdg14.png", "sdg15.png"]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

------------------------------
-- Insert sites data
------------------------------

-- Tipligheri site (assumes site_id will be 1)
INSERT INTO sites (
    project_id, name, type, area, boundary, mapbox_layer_url, cameras_installed,
    audio_devices, total_images_videos, total_audio_files, biodiversity_score,
    biodiversity_intactness, mean_species_abundance, potential_disappearance_fraction,
    human_intrusion_index, species_distribution, species_detected, 
    biodiversity_score_trend, biodiversity_intactness_trend, shannon_diversity,
    simpson_diversity, species_richness, species_diversity, taxonomic_dissimilarity,
    habitat_health, habitat_spatial_structure, habitat_map, species_habitat_health,
    species_protection_index, species_info_index, species_activity_trend,
    human_activity_trend, created_at, updated_at
) VALUES 
(
    1,
    'Tipligheri',
    'Restoration',
    68.83,
    ST_GeomFromGeoJSON('{"type": "Polygon", "coordinates": [[[77.0,21.0],[77.1,21.0],[77.1,21.1],[77.0,21.1],[77.0,21.0]]]}'),
    'https://api.mapbox.com/styles/v1/your-account/your-style/tiles/256/',
    2,
    2,
    304,
    845,
    0.66,
    0.78,
    0.62,
    0.4,
    0.4,
    '{"critically_endangered": [{"total": "2", "species_list": ["Fishing Cat", "Indian porcupine"]}], "endangered": []}'::jsonb,
    '{"2023": {"total_species": "15", "total_camera_images": "36", "total_audio_files": "132"}}'::jsonb,
    '[{"2010": 0.64, "2012": 0.63, "2014": 0.63}]'::jsonb,
    '[{"2010": 0.82, "2012": 0.81, "2014": 0.80}]'::jsonb,
    2.5,
    0.7,
    0.54,
    0.33,
    0.41,
    0.68,
    61,
    'https://api.mapbox.com/styles/v1/your-account/your-habitat-style/tiles/256/',
    0.82,
    0.5,
    0.73,
    '[{"00.00":6, "02.00":4, "04.00":2}]'::jsonb,
    '[{"00.00":0, "02.00":0, "04.00":0}]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Maipith site (assumes site_id will be 2)
INSERT INTO sites (
    project_id, name, type, area, boundary, mapbox_layer_url, cameras_installed,
    audio_devices, total_images_videos, total_audio_files, biodiversity_score,
    biodiversity_intactness, mean_species_abundance, potential_disappearance_fraction,
    human_intrusion_index, species_distribution, species_detected, 
    biodiversity_score_trend, biodiversity_intactness_trend, shannon_diversity,
    simpson_diversity, species_richness, species_diversity, taxonomic_dissimilarity,
    habitat_health, habitat_spatial_structure, habitat_map, species_habitat_health,
    species_protection_index, species_info_index, species_activity_trend,
    human_activity_trend, created_at, updated_at
) VALUES 
(
    1,
    'Maipith',
    'Restoration',
    25.68,
    ST_GeomFromGeoJSON('{"type": "Polygon", "coordinates": [[[77.2,21.0],[77.3,21.0],[77.3,21.1],[77.2,21.1],[77.2,21.0]]]}'),
    'https://api.mapbox.com/styles/v1/your-account/your-style/tiles/256/',
    2,
    2,
    200,
    400,
    0.67,
    0.73,
    0.65,
    0.33,
    0.4,
    '{"critically_endangered": [{"total": "1", "species_list": ["Species A"]}], "endangered": [{"total": "3", "species_list": ["Species B", "Species C", "Species D"]}]}'::jsonb,
    '{"2023": {"total_species": "18", "total_camera_images": "52", "total_audio_files": "129"}}'::jsonb,
    '[{"2010": 0.69, "2012": 0.69, "2014": 0.68}]'::jsonb,
    '[{"2010": 0.75, "2012": 0.75, "2014": 0.74}]'::jsonb,
    2.5,
    0.7,
    0.54,
    0.33,
    0.41,
    0.68,
    61,
    'https://api.mapbox.com/styles/v1/your-account/your-habitat-style/tiles/256/',
    0.82,
    0.5,
    0.73,
    '[{"00.00":3, "02.00":2, "04.00":1}]'::jsonb,
    '[{"00.00":0, "02.00":0, "04.00":0}]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Dwariknagar site (assumes site_id will be 3)
INSERT INTO sites (
    project_id, name, type, area, boundary, mapbox_layer_url, cameras_installed,
    audio_devices, total_images_videos, total_audio_files, biodiversity_score,
    biodiversity_intactness, mean_species_abundance, potential_disappearance_fraction,
    human_intrusion_index, species_distribution, species_detected, 
    biodiversity_score_trend, biodiversity_intactness_trend, shannon_diversity,
    simpson_diversity, species_richness, species_diversity, taxonomic_dissimilarity,
    habitat_health, habitat_spatial_structure, habitat_map, species_habitat_health,
    species_protection_index, species_info_index, species_activity_trend,
    human_activity_trend, created_at, updated_at
) VALUES 
(
    1,
    'Dwariknagar',
    'Conservation',
    66.04,
    ST_GeomFromGeoJSON('{"type": "Polygon", "coordinates": [[[77.4,21.1],[77.5,21.1],[77.5,21.2],[77.4,21.2],[77.4,21.1]]]}'),
    'https://api.mapbox.com/styles/v1/your-account/your-style/tiles/256/',
    2,
    2,
    400,
    500,
    0.76,
    0.79,
    0.72,
    0.23,
    0.4,
    '{"critically_endangered": [{"total": "2", "species_list": ["Fishing Cat", "Indian porcupine"]}], "endangered": [{"total": "4", "species_list": ["Species X", "Species Y", "Species Z", "Species W"]}]}'::jsonb,
    '{"2023": {"total_species": "15", "total_camera_images": "78", "total_audio_files": "142"}}'::jsonb,
    '[{"2010": 0.79, "2012": 0.79, "2014": 0.78}]'::jsonb,
    '[{"2010": 0.81, "2012": 0.81, "2014": 0.80}]'::jsonb,
    2.5,
    0.7,
    0.54,
    0.33,
    0.41,
    0.68,
    64.54,
    'https://api.mapbox.com/styles/v1/your-account/your-habitat-style/tiles/256/',
    0.82,
    0.5,
    0.73,
    '[{"00.00":5, "02.00":3, "04.00":2}]'::jsonb,
    '[{"00.00":0, "02.00":0, "04.00":0}]'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

------------------------------
-- Insert carbon project metrics (for project_id = 1)
------------------------------
INSERT INTO carbon_project_metrics (
    project_id, total_area, number_of_sites, temperature,
    temperature_unit, precipitation, precipitation_unit,
    soil_type, total_mean_biomass, total_mean_biomass_unit,
    total_mean_carbon_stock, total_mean_carbon_stock_unit,
    estimated_ghg_baseline_emissions, estimated_ghg_baseline_emissions_unit,
    baseline_start_date, total_removals, total_removals_unit,
    average_annual_removals, average_annual_removals_unit, created_at, updated_at
) VALUES (
    1,
    160.55,
    3,
    35.9,
    'deg C',
    154.6,
    'mm',
    'Histols',
    1687.46,
    'Mg/ha',
    706.54,
    't/ha',
    0,
    'tCo2e',
    2022,
    285732,
    'tCo2e',
    14287,
    'tCo2e',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

------------------------------
-- Insert carbon credits (for project_id = 1)
------------------------------
INSERT INTO carbon_credits (
    project_id, total_estimated_vcus, average_price_per_vcu,
    total_vcu_retired, vcus_available_for_sale, historical_vcus,
    created_at, updated_at
) VALUES (
    1,
    2400,
    25.00,
    945,
    1455,
    '{"2022": 0, "2023": 622.2, "2024": 2484.55}'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

------------------------------
-- Insert biodiversity credits (for project_id = 1)
------------------------------
INSERT INTO biodiversity_credits (
    project_id, overall_issued_retired, total_credits_over_crediting_period,
    credits_available_for_sale, average_price_per_credit,
    credit_retired, historical_credits_retirement, created_at, updated_at
) VALUES (
    1,
    '[{"issued":5000,"retired":3407}]'::jsonb,
    8407,
    1593,
    30.00,
    6148,
    '{"July 2023":1300, "October 2023":450, "December 2023":623}'::jsonb,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

------------------------------
-- Insert carbon site metrics for Tipligheri (site_id = 1)
------------------------------
INSERT INTO carbon_site_metrics (
    site_id, total_area, total_area_unit, total_plantation_area,
    total_plantation_area_unit, total_planted_trees, lulc_timeseries,
    surface_water_transition, soil_properties, soil_organic_carbon,
    soil_organic_carbon_unit, biomass_raster, carbon_stock_raster,
    created_at, updated_at
) VALUES (
    1,
    68.83,
    'ha',
    68.83,
    'ha',
    5000,
    '{"2022": {"Rainfed cropland": 0.81, "Irrigated cropland": 47.43}}'::jsonb,
    '{"Permanent": 0.03, "New permanent": 0.00, "Lost permanent": 0.29}'::jsonb,
    '{"sand": {"0cm": 0.34, "10cm": 0.34}, "clay": {"0cm": 0.33, "10cm": 0.33}}'::jsonb,
    0.84,
    't/ha',
    'https://api.mapbox.com/styles/v1/your-account/biomass-raster/tiles/256/',
    'https://api.mapbox.com/styles/v1/your-account/carbonstock-raster/tiles/256/',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

------------------------------
-- Insert carbon site metrics for Maipith (site_id = 2)
------------------------------
INSERT INTO carbon_site_metrics (
    site_id, total_area, total_area_unit, total_plantation_area,
    total_plantation_area_unit, total_planted_trees, lulc_timeseries,
    surface_water_transition, soil_properties, soil_organic_carbon,
    soil_organic_carbon_unit, biomass_raster, carbon_stock_raster,
    created_at, updated_at
) VALUES (
    2,
    25.68,
    'ha',
    25.68,
    'ha',
    3000,
    '{"2022": {"Rainfed cropland": 1.00, "Irrigated cropland": 40.00}}'::jsonb,
    '{"Permanent": 0.05, "New permanent": 0.01, "Lost permanent": 0.10}'::jsonb,
    '{"silt": {"0cm": 0.30, "10cm": 0.30}, "clay": {"0cm": 0.40, "10cm": 0.40}}'::jsonb,
    0.75,
    't/ha',
    'https://api.mapbox.com/styles/v1/your-account/biomass-raster/tiles/256/',
    'https://api.mapbox.com/styles/v1/your-account/carbonstock-raster/tiles/256/',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

------------------------------
-- Insert carbon site metrics for Dwariknagar (site_id = 3)
------------------------------
INSERT INTO carbon_site_metrics (
    site_id, total_area, total_area_unit, total_plantation_area,
    total_plantation_area_unit, total_planted_trees, lulc_timeseries,
    surface_water_transition, soil_properties, soil_organic_carbon,
    soil_organic_carbon_unit, biomass_raster, carbon_stock_raster,
    created_at, updated_at
) VALUES (
    3,
    66.04,
    'ha',
    66.04,
    'ha',
    4000,
    '{"2022": {"Rainfed cropland": 1.10, "Irrigated cropland": 50.00}}'::jsonb,
    '{"Permanent": 0.04, "New permanent": 0.02, "Lost permanent": 0.15}'::jsonb,
    '{"silt": {"0cm": 0.35, "10cm": 0.35}, "clay": {"0cm": 0.30, "10cm": 0.30}}'::jsonb,
    0.80,
    't/ha',
    'https://api.mapbox.com/styles/v1/your-account/biomass-raster/tiles/256/',
    'https://api.mapbox.com/styles/v1/your-account/carbonstock-raster/tiles/256/',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
