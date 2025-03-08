import pool from "./config"; // adjust the path as needed

// Database types and interfaces
export interface Project {
  id: number;
  name: string;
  project_identifier: string;
  project_start_date: Date;
  project_end_date: Date;
  status: string;
  country: string;
  description: string;
  project_type: string;
  total_area: number;
  emission_reduction_unit: string;
  total_emission_reduction: number;
  avg_annual_emission_reduction: number;
  crediting_period: string;
  project_developer: string;
  registry: string;
  image_2010: string;
  image_2015: string;
  image_2020: string;
  image_2024: string;
  sdg: any;
  created_at: Date;
  updated_at: Date;
}

export interface Site {
  id: number;
  project_id: number;
  name: string;
  type: string;
  area: number;
  boundary: any;
  mapbox_layer_url: string;
  cameras_installed: number;
  audio_devices: number;
  total_images_videos: number;
  total_audio_files: number;
  biodiversity_score: number;
  biodiversity_intactness: number;
  mean_species_abundance: number;
  potential_disappearance_fraction: number;
  human_intrusion_index: number;
  biodiversity_score_trend: any;
  mean_species_abundance_trend: any;
  biodiversity_intactness_trend: any;
  potential_disappearance_fraction_trend: any;
  shannon_diversity: number;
  simpson_diversity: number;
  species_richness: number;
  species_diversity: number;
  taxonomic_dissimilarity: number;
  habitat_health: number;
  habitat_spatial_structure: number;
  habitat_map: string;
  species_habitat_health: number;
  species_protection_index: number;
  species_info_index: number;
  species_distribution: any;
  species_detected: any;
  species_activity_trend: any;
  human_activity_trend: any;
  created_at: Date;
  updated_at: Date;
}

export interface CarbonProjectMetrics {
  id: number;
  project_id: number;
  total_area: number;
  number_of_sites: number;
  project_site_map: string;
  temperature: number;
  temperature_unit: string;
  precipitation: number;
  precipitation_unit: string;
  soil_type: string;
  total_mean_biomass: number;
  total_mean_biomass_unit: string;
  total_mean_carbon_stock: number;
  total_mean_carbon_stock_unit: string;
  estimated_ghg_baseline_emissions: number;
  estimated_ghg_baseline_emissions_unit: string;
  baseline_start_date: number;
  estimated_ghg_emissions_removals: any;
  total_removals: number;
  total_removals_unit: string;
  average_annual_removals: number;
  average_annual_removals_unit: string;
  created_at: Date;
  updated_at: Date;
}

export interface CarbonSiteMetrics {
  id: number;
  site_id: number;
  total_area: number;
  total_area_unit: string;
  total_plantation_area: number;
  total_plantation_area_unit: string;
  total_planted_trees: number;
  lulc_timeseries: any;
  surface_water_transition: any;
  soil_properties: any;
  soil_organic_carbon: number;
  soil_organic_carbon_unit: string;
  biomass_raster: string;
  carbon_stock_raster: string;
  created_at: Date;
  updated_at: Date;
}

export interface CarbonCredits {
  id: number;
  project_id: number;
  total_estimated_vcus: number;
  average_price_per_vcu: number;
  total_vcu_retired: number;
  vcus_available_for_sale: number;
  historical_vcus: any;
  created_at: Date;
  updated_at: Date;
}

export interface BiodiversityCredits {
  id: number;
  project_id: number;
  overall_issued_retired: any;
  total_credits_over_crediting_period: number;
  historical_credits_retirement: any;
  credits_available_for_sale: number;
  average_price_per_credit: number;
  credit_retired: number;
  created_at: Date;
  updated_at: Date;
}

export interface BiodiversityProjectMetrics {
  id: number;
  project_id: number;
  total_area: number;
  number_of_sites: number;
  cameras_installed: number;
  audio_devices_installed: number;
  total_images_videos: number;
  total_audio_files: number;
  total_species_identified: number;
  biodiversity_score: number;
  biodiversity_intactness: number;
  mean_species_abundance: number;
  potential_disappearance_fraction: number;
  human_intrusion_index: number;
  species_distribution: any;
  created_at: Date;
  updated_at: Date;
}

// Import data from local JSON for now
import data from "../db.json";

export const db = {
  async getProjects(): Promise<Project[]> {
    const query = "SELECT * FROM projects";
    const result = await pool.query(query);
    return result.rows;
  },

  async createProject(projectData: any): Promise<Project> {
    const query = `
      INSERT INTO projects (
        name, project_identifier, project_start_date, project_end_date,
        status, country, description, project_type, total_area,
        emission_reduction_unit, total_emission_reduction, avg_annual_emission_reduction,
        crediting_period, project_developer, registry
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      projectData.name,
      projectData.project_identifier,
      projectData.start_date,
      projectData.end_date,
      projectData.status,
      projectData.country,
      projectData.description,
      projectData.project_type,
      projectData.total_area,
      projectData.emission_reduction_unit,
      projectData.total_emission_reduction,
      projectData.avg_annual_emission_reduction,
      projectData.crediting_period,
      projectData.project_developer,
      projectData.registry,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async createSite(siteData: any): Promise<Site> {
    const query = `
      INSERT INTO sites (
        project_id, name, type, area, boundary
      ) VALUES ($1, $2, $3, $4, ST_GeomFromGeoJSON($5))
      RETURNING *
    `;
    const values = [
      siteData.project_id,
      siteData.name,
      siteData.type,
      siteData.area,
      siteData.boundary,
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async getProjectById(id: number): Promise<Project> {
    const project = (data.ProjectList as Project[]).find((p) => p.id === id);
    if (!project) {
      throw new Error("Project not found");
    }
    return project;
  }, // <-- Added missing comma

  async getSites(): Promise<Site[]> {
    return (data.ProjectList as any[])[0].sites;
  },

  async getSitesByProjectId(projectId: number): Promise<Site[]> {
    const project = (data.ProjectList as any[]).find((p) => p.id === projectId);
    return project ? project.sites : [];
  },

  async getSiteById(id: number): Promise<Site | null> {
    for (const project of data.ProjectList as any[]) {
      const site = project.sites.find((s: Site) => s.id === id);
      if (site) return site;
    }
    return null;
  },

  async getCarbonProjectMetrics(
    projectId: number
  ): Promise<CarbonProjectMetrics> {
    const metrics = (data.CarbonCredit as any[]).find(
      (p) => p.project_id === projectId
    );
    if (!metrics) {
      throw new Error("Carbon project metrics not found");
    }
    return metrics;
  },

  async getCarbonSiteMetrics(siteId: number): Promise<CarbonSiteMetrics> {
    const metrics = (data.CarbonCredit as any[])[0].sites.find(
      (s: any) => s.id === siteId
    );
    if (!metrics) {
      throw new Error("Carbon site metrics not found");
    }
    return metrics;
  },

  async getCarbonCredits(projectId: number): Promise<CarbonCredits> {
    const creditData = (data.CarbonCredit as any[]).find(
      (p) => p.project_id === projectId
    );
    if (!creditData || !creditData.credits) {
      throw new Error("Carbon credits not found");
    }
    return creditData.credits;
  },

  async getBiodiversityMetrics(
    projectId: number
  ): Promise<BiodiversityProjectMetrics> {
    const metrics = ((data.ProjectSite as any[][])[0][0] as BiodiversityProjectMetrics);
    if (!metrics) {
      throw new Error("Biodiversity metrics not found");
    }
    return metrics;
  },

  async getBiodiversityCredits(
    projectId: number
  ): Promise<BiodiversityCredits> {
    const credits = ((data.ProjectSite as any[][])[0][0] as any).credits;
    if (!credits) {
      throw new Error("Biodiversity credits not found");
    }
    return credits;
  },
};
