import { SelectChangeEvent } from "@mui/material";
import { ReactNode } from "react";
export interface SelectProps {
    label: string;
    options: { value: string | number; label: string }[];
    value: any;
    onChange: (event: SelectChangeEvent, child: React.ReactNode) => void;
    minWidth?: number;
    fullWidth?: boolean;
    multiple?: boolean;
    displayEmpty?: boolean; // Optional prop for placeholder handling
    renderValue?: (value: string | number | (string | number)[]) => string | undefined;
    placeholder?: string;
}
export interface RoutingProps {
    open: boolean;
}
export interface CardComponentProps {
    title: string;
    children: ReactNode;
}
export interface ProjectDashboardProps {
    title: string;
    subTitle: string;
}
export interface ProjectDetailComponentProps {
    id: string;
    title: string;
    subTitle: string;
    icon?: React.ReactNode;
    startDateTitle: string;
    startDate: string;
    endDateTitle: string;
    endDate: string;
    detailTitle: string;
    details: string;
    mapTitle?: string;
    children?: React.ReactNode;
    projectType: string;
    numberOfSites: string;
    sdg?: string[];
    creditPeriod: string;
    reductionUnit: string;
    avgReduction: string;
    totalReduction: string;
    totalArea: string;
}
export interface SiteDetailCardProps {
    siteTitle: string;
    siteDetail?: string;
}
export interface SiteCardProps {
    title: string;
    amount: number | string;
    icon?: string;
}
export interface DownloadCardComponentProps {
    title: string;
    btnName: string;
    handleButtonEvent: (selectedData: SelectedDataItem[]) => void;
    data: string[];
    dataId: string[],
    checkboxes: string[],
    dateTitle: string[],
    date: string[],
    scoreTitle: string[],
    score: string[],
    url: string[]
}
export interface SelectedDataItem extends Record<string, unknown> {
    type: string;
    id: string;
    date: string;
    score: number;
    url: string;
}

export interface MapContainerComponentProps {
    icon: string;
    handleEvent: () => void;
    title: string;
}
export interface MapCardComponentProps {
    icon: string;
    handleEvent?: () => void;
    rightTitle: string;
    leftTitle: string;
}
export interface MapComponentProps {
    latitude: number;
    longitude: number;
}
export interface ProjectRowType {
    id?: string | number;
    name: string;
    status: string;
    start: string;
    end: string;
    type: string;
    country: string;
    registry?: string;
}
export interface ProjectType {
    project_name: string;
    project_status: string;
    project_start_date: string;
    project_end_date: string;
    project_type: string;
    country: string;
    registry: string;
}
export interface Site {
    site_name: string;
    type: string;
    total_area: number;
    total_area_unit: string;
    total_plantation_area: string;
    total_plantation_area_unit: string;
    total_planted_trees: number;
    lulc_transition_piechart?: Record<number, Record<string, number>>;
    lulc_timeseries?: Record<number, Record<string, number>>;
    surface_water_transition?: Record<string, number>;
    soc?: Record<string, number>;
    soil_properties?: Record<string, Record<string, number>>;
}
export interface SeriesProps {
    name: string;
    data: number[];
}
export interface ProjectSite {
    sites: Site[];
}
export interface CreditData {
    buffer_units: Record<string, number>;
    estimated_issued_vcu: Record<string, number>;
    estimated_retired_vcu: Record<string, number>;
    total_estimated_issued_vcu: number;
    average_price_per_vcu: string;
    total_vcu_retired: number;
    vcu_available_for_sale: number;
    vcu: Record<string, number>;
}
export interface GalleryItem {
    url: string;
    name: string;
}
export interface ProjectGallery {
    gallery?: GalleryItem[];
}

export interface ProjectDetailCard {
    imageSrc: string;
    title: string;
    data: { label: string, value: string | number, color?: string, tooltip?: string }[];
}
export interface Field {
    key: string;
    label: string;
    icon: string;
}
export interface ProjectDetailCardProps {
    data: Array<{ [key: string]: string | number; name: string; type: string }>;
    handleSelect: (item: { [key: string]: string | number }) => void;
    getLink: (item: { [key: string]: string | number }) => string;
    image: string;
    fields: Field[];
}
export interface CreditCardProps {
    data: Array<{
        label: string; value: string | number;
        xs?: number;
        sm?: number;
    }>
}
export interface ProjectSiteCardProps {
    title: string;
    projectSites: '';
    onSelectSite: (item: string) => void;
}
export interface SpeciesData {
    id: string;
    type: string;
    device?: string;
    date: string;
    score: number;
    name: string;
    url: string | null;
}
export interface SensorOption {
    label: string;
    value: string;
}
export interface SiteDetails {
    site_name: string;
    species_detected: Array<Record<string, string | number | boolean | null>>;
}
export interface ImageSpecies {
    camera_id: string;
    Type: string;
    Date: string;
    Confidence_Score: number;
    Name: string;
}
export interface AudioSpecies {
    audiomoth_id: string;
    Type: string;
    Date: string;
    Confidence_Score: number;
    Name: string;
}
export interface Gallery {
    url: string;
}
export interface MapFeature {
    Name: string;
    Type: string;
    Area: string | number;
}
export interface SiteAttribute {
    key: string;
    label: string;
    icon: string;
}

export interface ProjectSitesCarouselProps {
    title: string;
    data: any[];
    detailPage: string;
    handleSelectSite: (site: any) => void;
    siteAttributes: SiteAttribute[];
}
export interface SubMenuItem {
    text: string;
    path: string;
  };
  
export interface SideNavItem{
    text: string;
    path: string;
    icon: React.ElementType; // Adjust based on your icon type (e.g., Material UI icons)
    subMenu?: SubMenuItem[];
  };
  