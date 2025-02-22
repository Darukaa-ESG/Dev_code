import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { Box, Card, CardMedia, Typography } from '@mui/material';
import ProjectListData from '../../../../db.json';
import BiodiversityMap from '../../../../resources/images/biodevmap.png'

const CarbonAnalysisSite = () => {
    const [projectCarbon] = useState(ProjectListData.CarbonCredit);

    return (
        <Box sx={{
            width: '100%',
            height: '100vh', // Full viewport height for the container
            overflow: 'hidden',
            backgroundColor: '#f5f5f5',
            p: 2
        }}>
            <Box className='bio-map' sx={{ mb: 2 }}>
                <img src={BiodiversityMap} alt="map" className='bio-map-img' />
            </Box>
            <Box>
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: "24px", fontWeight: 600, color: "#151E15" }}>{'Project Title'}</Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    overflowX: 'auto',
                    gap: 2,
                    p: 1,
                    '&::-webkit-scrollbar': {
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ccc',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f5f5f5',
                    }
                }}>
                    {projectCarbon && projectCarbon[0]?.sites.map((site: any, index: number) => {
                        return (
                            <Link to={`/carbonanalysis-analysis-detail`} style={{ textDecoration: 'none' }} key={index} state={site} onClick={() => localStorage.setItem('site', JSON.stringify(site))}>
                                <Card sx={{ display: 'flex', width: "400px", backgroundColor: "#151E15", borderRadius: 2, overflow: 'hidden', m: 1 }}>
                                    <Box sx={{ flex: 1 }}>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: '100%', objectFit: 'cover' }}
                                            image={BiodiversityMap}
                                            alt="Site image"
                                        />
                                    </Box>

                                    <Box sx={{
                                        display: 'flex', flexDirection: 'column', padding: 2, gap: 1.5,
                                        flex: 1, overflow: 'auto', maxHeight: '200px', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' }
                                    }}>
                                        <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "#fff" ,textAlign:'center'}}>
                                            {site.site_name}
                                        </Typography>
                                        <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#fff",textAlign:'center' }}>
                                            {site.type}
                                        </Typography>

                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                                                <Box sx={{ ml: 3 }}>
                                                    <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>{'Area Covered'}</Typography>
                                                    <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>{projectCarbon[0]?.total_area}</Typography>
                                                </Box>
                                                <Box sx={{ ml: 3 }}>
                                                    <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>{'Total Area Unit'}</Typography>
                                                    <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>{site.total_area_unit}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                                                <Box sx={{ ml: 3 }}>
                                                    <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>{'Total Plantation Area'}</Typography>
                                                    <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>{site.total_plantation_area}</Typography>
                                                </Box>
                                                <Box sx={{ ml: 3 }}>
                                                    <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>{'Total Plantation Area Unit'}</Typography>
                                                    <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>{site.total_plantation_area_unit}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#fff' }}>
                                                <Box sx={{ ml: 3 }}>
                                                    <Typography sx={{ fontSize: "13px", fontWeight: 700 }}>{'Total Planted Trees'}</Typography>
                                                    <Typography sx={{ fontSize: "12px", fontWeight: 600 }}>{site.total_planted_trees}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </Link>
                        )
                    })}
                </Box>
            </Box>
        </Box>
    )
}

export default CarbonAnalysisSite