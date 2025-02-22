import { Route, Routes } from "react-router-dom";
import { RoutingProps } from "../Interface/Index";
import { FC } from "react";
import { MainComponentLayout } from "../component/view/Container";
import ProjectComponent from "../component/view/Pages/Index";
import ProjectDetail from "../component/view/Pages/ProjectDetail";
import BiodiversityDashboardSiteInfo from "../component/view/Pages/Biodiversity/BiodiversityDashabordSiteInfo";
import BiodiversityAnalysisDetail from "../component/view/Pages/Biodiversity/BiodiversityAnalysisDetail";
import BiodiversityDownloadFilter from "../component/view/Pages/Biodiversity/BiodiversityDownloadFilter";
import BiodiversityCreditDetail from "../component/view/Pages/Biodiversity/BiodiversityCreditDetail";
import CarbonDashboard from "../component/view/Pages/Carbon/CarbonDashboard";
import CarbonAnalysisSite from "../component/view/Pages/Carbon/CarbonAnalysisSite";
import CarbonAnalysisDetails from "../component/view/Pages/Carbon/CarbonAnalysisDetails";
import CarbonCredit from "../component/view/Pages/Carbon/CarbonCredit";
import EnvDashboard from "../component/view/Pages/Environment/EnvDashboard";
import EnvAnalysisDetail from "../component/view/Pages/Environment/EnvAnalysisDetail";

const Routing: FC<RoutingProps> = ({ open }) => {
  return (
    <Routes>
      <Route path='/' element={<MainComponentLayout open={open} mainContent={<ProjectComponent />} />} />
      <Route path='/project-details' element={<MainComponentLayout open={open} mainContent={<ProjectDetail />} />} />
      {/* Biodiversity */}
      <Route path='/biodiversity' element={<MainComponentLayout open={open} mainContent={< BiodiversityDashboardSiteInfo />} />} />
      <Route path='/biodiversity-analysis-detail' element={<MainComponentLayout open={open} mainContent={< BiodiversityAnalysisDetail />} />} />
      <Route path='/biodiversitycredits' element={<MainComponentLayout open={open} mainContent={<BiodiversityCreditDetail />} />} />
      <Route path='/biodiversity-species-data' element={<MainComponentLayout open={open} mainContent={<BiodiversityDownloadFilter />} />} />
      {/* Carbon */}
      <Route path='/carbonanalysis' element={<MainComponentLayout open={open} mainContent={<CarbonDashboard />} />} />
      <Route path='/carbonanalysis-site' element={<MainComponentLayout open={open} mainContent={<CarbonAnalysisSite />} />} />
      <Route path='/carbonanalysis-analysis-detail' element={<MainComponentLayout open={open} mainContent={<CarbonAnalysisDetails />} />} />
      <Route path='/carbonanalysiscredits' element={<MainComponentLayout open={open} mainContent={<CarbonCredit />} />} />
      {/* Environmental */}
      <Route path='/environmentalreport' element={<MainComponentLayout open={open} mainContent={<EnvDashboard />} />} />
      <Route path='/environmentalreport-analysis-detail' element={<MainComponentLayout open={open} mainContent={<EnvAnalysisDetail />} />} />

    </Routes>
  )
}

export default Routing