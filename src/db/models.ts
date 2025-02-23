
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
}

// Import data from local JSON for now
import data from '../../db.json';

export const db = {
  async getProjects(): Promise<Project[]> {
    return data.ProjectList;
  },

  async getProjectById(id: number): Promise<Project> {
    return data.ProjectList.find((p: Project) => p.id === id);
  },

  async getSites(): Promise<Site[]> {
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

  async getCarbonMetrics(projectId: number) {
    return data.CarbonCredit.find((p: any) => p.id === projectId);
  },

  async getCarbonSiteMetrics(siteId: number) {
    return data.CarbonCredit[0].sites.find((s: any) => s.id === siteId);
  },

  async getBiodiversityMetrics(projectId: number) {
    return data.ProjectSite[0][0];
  },

  async getCarbonCredits(projectId: number) {
    return data.CarbonCredit[0].credits;
  },

  async getBiodiversityCredits(projectId: number) {
    return data.ProjectSite[0][0].credits;
  }
};
