
import { Pool } from 'pg';

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

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const db = {
  async getProjects(): Promise<Project[]> {
    const result = await pool.query('SELECT * FROM projects');
    return result.rows;
  },

  async getProjectById(id: number): Promise<Project> {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0];
  },

  async getSites(): Promise<Site[]> {
    const result = await pool.query('SELECT * FROM sites');
    return result.rows;
  },

  async getSitesByProjectId(projectId: number): Promise<Site[]> {
    const result = await pool.query('SELECT * FROM sites WHERE project_id = $1', [projectId]);
    return result.rows;
  },

  async getSiteById(id: number): Promise<Site> {
    const result = await pool.query('SELECT * FROM sites WHERE id = $1', [id]);
    return result.rows[0];
  },

  async getCarbonMetrics(projectId: number) {
    const result = await pool.query('SELECT * FROM carbon_project_metrics WHERE project_id = $1', [projectId]);
    return result.rows[0];
  },

  async getCarbonSiteMetrics(siteId: number) {
    const result = await pool.query('SELECT * FROM carbon_site_metrics WHERE site_id = $1', [siteId]);
    return result.rows[0];
  },

  async getBiodiversityMetrics(projectId: number) {
    const result = await pool.query('SELECT * FROM biodiversity_project_metrics WHERE project_id = $1', [projectId]);
    return result.rows[0];
  },

  async getCarbonCredits(projectId: number) {
    const result = await pool.query('SELECT * FROM carbon_credits WHERE project_id = $1', [projectId]);
    return result.rows[0];
  },

  async getBiodiversityCredits(projectId: number) {
    const result = await pool.query('SELECT * FROM biodiversity_credits WHERE project_id = $1', [projectId]);
    return result.rows[0];
  }
};
