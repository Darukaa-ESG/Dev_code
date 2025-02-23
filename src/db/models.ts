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
  sdg: any; // e.g., string[]
  created_at: Date;
  updated_at: Date;
}

export interface Site {
  id: number;
  project_id: number;
  name: string;
  type: string;
  area: number;
  boundary: any; // typically GeoJSON or a PostGIS geometry object
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
  biodiversity_score_trend: any; // JSON data
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
  species_distribution: any; // JSON data for threat levels breakdown
  species_detected: any; // JSON data for detected species details by year
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
  project_site_map: string; // reference to Mapbox layer or shapefile path
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
  estimated_ghg_emissions_removals: any; // JSON data keyed by year
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
  lulc_timeseries: any; // JSON data keyed by year with LULC breakdowns
  surface_water_transition: any; // JSON data (e.g., percentages, transition metrics)
  soil_properties: any; // JSON structure for pH, texture, nutrients, etc.
  soil_organic_carbon: number;
  soil_organic_carbon_unit: string;
  biomass_raster: string; // URL or file path (Mapbox-hosted)
  carbon_stock_raster: string; // URL or file path (Mapbox-hosted)
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
  historical_vcus: any; // JSON data with yearly breakdowns
  created_at: Date;
  updated_at: Date;
}

export interface BiodiversityCredits {
  id: number;
  project_id: number;
  overall_issued_retired: any; // JSON, e.g., [{ issued: 5000, retired: 3407 }]
  total_credits_over_crediting_period: number;
  historical_credits_retirement: any; // JSON data (e.g., monthly or period-based)
  credits_available_for_sale: number;
  average_price_per_credit: number;
  credit_retired: number;
  created_at: Date;
  updated_at: Date;
}

// (Optional) If you need a separate table for aggregated project-level biodiversity metrics,
// you can add an interface like this:
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
    return data.ProjectList;
  },

  async getProjectById(id: number): Promise<Project> {
    return data.ProjectList.find((p: Project) => p.id === id);
  },

  async getSites(): Promise<Site[]> {
    // Assumes the first project's sites represent sample data.
    return data.ProjectList[0].sites;
  },

  async getSitesByProjectId(projectId: number): Promise<Site[]> {
    const project = data.ProjectList.find((p: any) => p.id === projectId);
    return project ? project.sites : [];
  },

  async getSiteById(id: number): Promise<Site> {
    for (const project of data.ProjectList) {
      const site = project.sites.find((s: Site) => s.id === id);
      if (site) return site;
    }
    return null;
  },

  async getCarbonProjectMetrics(
    projectId: number,
  ): Promise<CarbonProjectMetrics> {
    return data.CarbonCredit.find((p: any) => p.project_id === projectId);
  },

  async getCarbonSiteMetrics(siteId: number): Promise<CarbonSiteMetrics> {
    // Assumes the first element in CarbonCredit.sites contains the site data.
    return data.CarbonCredit[0].sites.find((s: any) => s.id === siteId);
  },

  async getCarbonCredits(projectId: number): Promise<CarbonCredits> {
    // Adjust indexing as needed; here we assume a matching project_id exists.
    return data.CarbonCredit.find((p: any) => p.project_id === projectId)
      ?.credits;
  },

  async getBiodiversityMetrics(projectId: number): Promise<any> {
    // For now, using the first element of the ProjectSite array as a placeholder.
    return data.ProjectSite[0][0];
  },

  async getBiodiversityCredits(
    projectId: number,
  ): Promise<BiodiversityCredits> {
    // Adjust indexing as needed; here we use the credits from the first element.
    return data.ProjectSite[0][0].credits;
  },
};
