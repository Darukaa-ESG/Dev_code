-- 002_environmental_reporting.sql
-- Create environmental reporting tables

-- Table for project-level environmental reporting data
CREATE TABLE IF NOT EXISTS environmental_reporting_projects (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    total_area DECIMAL,
    number_of_sites INTEGER,
    project_site_map VARCHAR(255),
    overall_risk_score DECIMAL,
    overall_risk_category VARCHAR(50),
    value_at_risk VARCHAR(50),
    chronic_risks JSONB,         -- e.g., {"Flood_risk": "Moderately_High", "Sea Sea_level_rise_risk": "Moderately_High", "Extreme_heat_risk": "Low", "Drought_risk": "Low"}
    acute_risks JSONB,           -- e.g., {"Extreme_precipitation_risk": "High", "Wildfire_risk": "Moderate", "Extreme_cold_risk": "Low", "Landslide_risk": "Low", "Tropical_cyclone_risk": "High"}
    climate_projections JSONB,   -- Nested object for Optimistic, Intermediate, and Extreme scenarios (with Near_Term, Mid_Term, Long_Term)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for site-level environmental reporting data
CREATE TABLE IF NOT EXISTS environmental_reporting_sites (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    site_id INTEGER REFERENCES sites(id) ON DELETE CASCADE,
    site_name VARCHAR(255),
    type VARCHAR(100),
    area DECIMAL,
    path VARCHAR(255),
    site_risk_score DECIMAL,
    site_risk_category VARCHAR(50),
    chronic_risks JSONB,         -- Site-specific chronic risks as JSONB
    acute_risks JSONB,           -- Site-specific acute risks as JSONB
    climate_projections JSONB,   -- Climate projections for the site (if applicable)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
