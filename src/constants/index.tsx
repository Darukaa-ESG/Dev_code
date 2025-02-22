import { ReactComponent as HomeIcon } from '../resources/images/Home.svg';
import { ReactComponent as CarbonCreditIcon } from '../resources/images/Credit1.svg';
import { ReactComponent as BioCreditIcon } from '../resources/images/Biocredit.svg';
import { ReactComponent as BioMonitorIcon } from '../resources/images/Biomonitor.svg';
import { SideNavItem } from '../Interface/Index';

export const sideNavs: SideNavItem[] = [
  { text: 'Project Overview', path: '/project-details', icon: HomeIcon },
  { text: 'Carbon Analysis', path: '/carbonanalysis', icon: CarbonCreditIcon },
  { text: 'Biodiversity Analysis', path: '/biodiversity', icon: BioCreditIcon },
  { text: 'Environmental Reporting', path: '/environmentalreport', icon: BioMonitorIcon },
];

export const getIntactnessRangeCategory = (value: number) => {
  if (value >= 0.75) {
    return { color: "green", label: "Good" };
  } else if (value >= 0.50) {
    return { color: "#FF9302", label: "Medium" };
  } else {
    return { color: "red", label: "Bad" };
  }
};
export const getSpeciesAbundanceRangeCategory = (value: number) => {
  if (value >= 0.70) {
    return { color: "green", label: "Good" };
  } else if (value >= 0.40) {
    return { color: "#FF9302", label: "Medium" };
  } else {
    return { color: "red", label: "Bad" };
  }
};
export const getPotentialRangeCategory = (value: number) => {
  if (value >= 0.21) {
    return { color: "red", label: "Good" };
  } else if (value >= 0.41) {
    return { color: "#FF9302", label: "Medium" };
  } else {
    return { color: "green", label: "Bad" };
  }
};

export const getShannonRangeCategory = (score: number) => {
  if (score >= 2.50) {
    return { color: "green" }; // Good (High diversity and even distribution)
  } else if (score >= 1.50 && score < 2.50) {
    return { color: "#FF9302" }; // Medium (Moderate diversity)
  } else if (score < 1.50) {
    return { color: "red" }; // Bad (Low diversity, uneven distribution)
  }
  return { color: "gray" }; // Default color for invalid scores
};
export const getTaxonomicDissimilarityRangeCategory = (value: number) => {
  if (value >= 0.61) {
    return { color: "red", label: "Good" };
  } else if (value >= 0.31) {
    return { color: "#FF9302", label: "Medium" };
  } else {
    return { color: "green", label: "Bad" };
  }
};
export const getHumanIntrusionRangeCategory = (value: number) => {
  if (value >= 0.51) {
    return { color: "red", label: "Good" };
  } else if (value >= 0.21) {
    return { color: "#FF9302", label: "Medium" };
  } else {
    return { color: "green", label: "Bad" };
  }
};

export const getHabitatHealthRangeCategory = (score: number) => {
  if (score >= 70) {
    return { color: "green", label: "Good (Habitat is well-suited for species)" };
  } else if (score >= 40 && score < 70) {
    return { color: "#FF9302", label: "Medium (Moderate suitability for species)" };
  } else if (score >= 0 && score < 40) {
    return { color: "red", label: "Bad (Unsuitable habitats for species)" };
  }
  return { color: "gray", label: "N/A (Invalid score)" }; // Default for invalid scores
};

export const convertToNumber = (value: string | number): number => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num; // If not a number, return 0 as fallback
};
