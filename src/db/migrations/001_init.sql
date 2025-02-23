
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
    image_2010 TEXT,
    image_2015 TEXT,
    image_2020 TEXT,
    image_2024 TEXT,
    sdg JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sites table
CREATE TABLE IF NOT EXISTS sites (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    area DECIMAL,
    boundary JSONB,
    mapbox_layer_url TEXT,
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
    habitat_map TEXT,
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

-- Create index on commonly queried fields
CREATE INDEX idx_project_name ON projects(name);
CREATE INDEX idx_project_status ON projects(status);
CREATE INDEX idx_project_country ON projects(country);
CREATE INDEX idx_site_project_id ON sites(project_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at
    BEFORE UPDATE ON sites
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
