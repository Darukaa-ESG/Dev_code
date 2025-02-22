import { Box, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Process from '../../../resources/images/process.png';
import { ProjectDetailComponent } from '../../common/detailComponent'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SDG1 from '../../../resources/images/SDG1.png';
import SDG2 from '../../../resources/images/SDG2.png';
import SDG3 from '../../../resources/images/SDG5.png';
import SDG4 from '../../../resources/images/SDG8.png';
import SDG5 from '../../../resources/images/SDG13.png';
import SDG6 from '../../../resources/images/SDG14.png';
import SDG7 from '../../../resources/images/SDG15.png';
import ProjectListData from '../../../db.json';
import DMapTile from './DMap/DMapPO'
import { Gallery } from '../../../Interface/Index';

const ProjectDetail = () => {
    const [projectList] = useState(ProjectListData.ProjectList);
    const navigate = useNavigate();
    const handleBack = () => {
        navigate('/');
    }
    const images = projectList[0]?.gallery?.filter((i) =>
        i.url.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i)
    );

    const videos = projectList[0]?.gallery?.filter((i) =>
        i.url.match(/\.(mp4|wav|ogg|aac|mp3)$/i)
    );

    const galleryItems = [...images as Gallery[], ...videos as Gallery[]]; // Combine images and videos

    const chunkArray = <T,>(array: T[], size: number): T[][] => {
        const result: T[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    return (
        <Box>
            <Button className="back-btn" onClick={handleBack} startIcon={<ArrowBackIcon />}>Back</Button>
            <ProjectDetailComponent
                id={projectList[0].project_id}
                title={projectList[0].project_name}
                subTitle={projectList[0].project_status}
                icon={Process}
                startDateTitle={"Credit Period Start"}
                startDate={projectList[0].project_start_date}
                endDateTitle={"Credit Period End"}
                endDate={projectList[0].project_end_date}
                detailTitle={projectList[0].project_developer}
                details={projectList[0].project_description}
                projectType={projectList[0].project_type}
                numberOfSites={projectList[0].number_of_sites}
                sdg={[SDG1, SDG2, SDG3, SDG4, SDG5, SDG6, SDG7]}
                reductionUnit={projectList[0].emission_reduction_unit}
                creditPeriod={projectList[0].crediting_period}
                avgReduction={projectList[0].avg_annual_emission_reduction}
                totalReduction={`${projectList[0].total_emission_reduction_over_crediting_period} ${projectList[0].emission_reduction_unit}`}
                totalArea={projectList[0].total_area}
            >
                <Box>
                    <DMapTile />
                </Box>
                <Box sx={{ my: 2 }}>
                    <Typography sx={{ fontSize: '22px', fontWeight: 600, my: 2 }}>Project Gallery</Typography>
                    <Swiper
                        navigation={true}
                        modules={[Navigation]}
                        spaceBetween={0}
                        slidesPerView={4} // Adjust to show one chunk per view
                        breakpoints={{
                            320: {
                                slidesPerView: 1,
                                spaceBetween: 0,
                            },
                            640: {
                                slidesPerView: 3,
                                spaceBetween: 0,
                            },
                        }}
                    >
                        {chunkArray(galleryItems, 4).map((chunk, chunkIndex) => (
                            <SwiperSlide key={`chunk-${chunkIndex}`}>
                                <Box display="flex" gap="5px" flexWrap="wrap" justifyContent="center">
                                    {chunk.map((item, index) => (
                                        <Box key={`item-${chunkIndex}-${index}`} width="45%">
                                            {item.url.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ? (
                                                <img
                                                    src={item.url}
                                                    alt="Gallery Item"
                                                    style={{
                                                        width: "100%",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                    }}
                                                />
                                            ) : (
                                                <video
                                                    controls
                                                    preload="none"
                                                    style={{
                                                        width: "100%",
                                                        height: "150px",
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    <source src={item.url} type="video/mp4" />
                                                    Your browser does not support the video tag.
                                                </video>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Box>
            </ProjectDetailComponent>
        </Box>
    )
}

export default ProjectDetail;
