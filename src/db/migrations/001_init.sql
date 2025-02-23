-- 001_init.sql

-- Enable PostGIS extension for geospatial support
CREATE EXTENSION IF NOT EXISTS postgis;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    project_identifier VARCHAR(100),
    project_start_date DATE,
    project_end_date DATE,
    status VARCHAR(50),
    country VARCHAR(100),
    description TEXT,
    project_type VARCHAR(100),
    total_area DECIMAL,
    emission_reduction_unit VARCHAR(50),
    total_emission_reduction DECIMAL,
    avg_annual_emission_reduction DECIMAL,
    crediting_period VARCHAR(50),
    project_developer VARCHAR(255),
    registry VARCHAR(100),
    image_2010 VARCHAR(255),
    image_2015 VARCHAR(255),
    image_2020 VARCHAR(255),
    image_2024 VARCHAR(255),
    sdg JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sites table (using PostGIS for boundaries)
CREATE TABLE IF NOT EXISTS sites (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    area DECIMAL,
    boundary GEOMETRY(POLYGON, 4326),
    mapbox_layer_url VARCHAR(255),
    cameras_installed INTEGER,
    audio_devices INTEGER,
    total_images_videos INTEGER,
    total_audio_files INTEGER,
    biodiversity_score DECIMAL,
    biodiversity_intactness DECIMAL,
    mean_species_abundance DECIMAL,
    potential_disappearance_fraction DECIMAL,
    human_intrusion_index DECIMAL,
    biodiversity_score_trend JSONB,
    mean_species_abundance_trend JSONB,
    biodiversity_intactness_trend JSONB,
    potential_disappearance_fraction_trend JSONB,
    shannon_diversity DECIMAL,
    simpson_diversity DECIMAL,
    species_richness DECIMAL,
    species_diversity DECIMAL,
    taxonomic_dissimilarity DECIMAL,
    habitat_health DECIMAL,
    habitat_spatial_structure DECIMAL,
    habitat_map VARCHAR(255),
    species_habitat_health DECIMAL,
    species_protection_index DECIMAL,
    species_info_index DECIMAL,
    species_distribution JSONB,
    species_detected JSONB,
    species_activity_trend JSONB,
    human_activity_trend JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carbon Project Metrics table
CREATE TABLE IF NOT EXISTS carbon_project_metrics (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    total_area DECIMAL,
    number_of_sites INTEGER,
    project_site_map VARCHAR(255),  -- Mapbox layer or shapefile reference
    temperature DECIMAL,
    temperature_unit VARCHAR(50),
    precipitation DECIMAL,
    precipitation_unit VARCHAR(50),
    soil_type VARCHAR(100),
    total_mean_biomass DECIMAL,
    total_mean_biomass_unit VARCHAR(50),
    total_mean_carbon_stock DECIMAL,
    total_mean_carbon_stock_unit VARCHAR(50),
    estimated_ghg_baseline_emissions DECIMAL,
    estimated_ghg_baseline_emissions_unit VARCHAR(50),
    baseline_start_date INTEGER,
    estimated_ghg_emissions_removals JSONB,  -- keyed by year (e.g., {"2023":732, ...})
    total_removals DECIMAL,
    total_removals_unit VARCHAR(50),
    average_annual_removals DECIMAL,
    average_annual_removals_unit VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carbon Site Metrics table (includes additional environmental details)
CREATE TABLE IF NOT EXISTS carbon_site_metrics (
    id SERIAL PRIMARY KEY,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    total_area DECIMAL,
    total_area_unit VARCHAR(50),
    total_plantation_area DECIMAL,
    total_plantation_area_unit VARCHAR(50),
    total_planted_trees INTEGER,
    lulc_timeseries JSONB,
    surface_water_transition JSONB,
    soil_properties JSONB,
    soil_organic_carbon DECIMAL,
    soil_organic_carbon_unit VARCHAR(50),
    biomass_raster VARCHAR(255),       -- URL/path for biomass raster (Mapbox hosted)
    carbon_stock_raster VARCHAR(255),   -- URL/path for carbon stock raster
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carbon Credits table (for carbon module)
CREATE TABLE IF NOT EXISTS carbon_credits (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    total_estimated_vcus DECIMAL,
    average_price_per_vcu DECIMAL,
    total_vcu_retired DECIMAL,
    vcus_available_for_sale DECIMAL,
    historical_vcus JSONB,  -- yearly breakdown or additional charts data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Biodiversity Credits table (for biodiversity module)
CREATE TABLE IF NOT EXISTS biodiversity_credits (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    overall_issued_retired JSONB,  -- e.g., [{"issued":5000,"retired":3407}]
    total_credits_over_crediting_period DECIMAL,
    historical_credits_retirement JSONB,
    credits_available_for_sale DECIMAL,
    average_price_per_credit DECIMAL,
    credit_retired DECIMAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes on commonly queried fields
CREATE INDEX IF NOT EXISTS idx_project_name ON projects(name);
CREATE INDEX IF NOT EXISTS idx_project_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_project_country ON projects(country);
CREATE INDEX IF NOT EXISTS idx_site_project_id ON sites(project_id);

-- Create trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for projects and sites tables
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- (Optional) Create triggers for the additional tables if needed.
CREATE TRIGGER update_carbon_project_metrics_updated_at
    BEFORE UPDATE ON carbon_project_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carbon_site_metrics_updated_at
    BEFORE UPDATE ON carbon_site_metrics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carbon_credits_updated_at
    BEFORE UPDATE ON carbon_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_biodiversity_credits_updated_at
    BEFORE UPDATE ON biodiversity_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
