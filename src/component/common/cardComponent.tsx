import React from 'react';
import { Box, Card, IconButton, Tooltip, Typography, CardMedia, Divider } from '@mui/material'
import Grid from '@mui/material/Grid2'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import { CardComponentProps, CreditCardProps, ProjectDetailCard, ProjectDetailCardProps, ProjectSitesCarouselProps } from '../../Interface/Index'
import BiodiversityMap from '../../resources/images/biodevmap.png';

export const CardComponent: React.FC<CardComponentProps> = ({ title, children }) => {
  return (
    <Card sx={{
      boxShadow: "0px 0px 5px 0px rgba(0, 0, 0, 0.1019607843) !important",
      borderRadius: '8px',
      backgroundColor: '#fff',
      margin: "8px"
    }}>
      <Typography
        component="div"
        sx={{ textAlign: "left", fontSize: "18px", fontWeight: 600, color: '#151E15', p: "16px" }}
      >
        {title}
      </Typography>
      <Box className='divider' />
      <Box>
        {children}
      </Box>
    </Card>
  )
}

export const ProjectInfoCard: React.FC<ProjectDetailCard> = ({ imageSrc, title, data }) => {
  return (
    <Grid size={{ xs: 12, md: 3 }} px={1}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          component="img"
          src={imageSrc}
          alt={title}
          sx={{ width: "45px", height: "35px", objectFit: "contain" }}
        />
        <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "#151E15", py: 2 }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid #D9D9D9" }} gap={2} />
      <Box sx={{ display: "flex", flexDirection: "column", padding: "16px", marginLeft: "40px" }} gap={2}>
        {data.map((item, index) => (
          <Box key={index}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography sx={{ color: "#666666", fontWeight: 600, fontSize: "16px" }}>
                {item.label}
              </Typography>
              {item.tooltip && (
                <Tooltip title={item.tooltip} arrow placement="top">
                  <IconButton size="small" sx={{ padding: 0, color: "#666666" }}>
                    <InfoOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
            <Typography sx={{ color: item.color || "#000", fontWeight: 500, fontSize: "20px" }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Grid>
  );
};

export const ProjectCards: React.FC<ProjectDetailCardProps> = ({ data, handleSelect, getLink, image, fields }) => {
  return (
    <Box>
      <Typography sx={{ fontSize: "24px", fontWeight: 600, color: "#151E15", margin: "5px" }}>{'Project Sites'}</Typography>
      <Box sx={{ display: 'flex', gap: 2, p: 1 }}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          style={{ width: '100%' }}
        >
          {data.map((item, index) => (
            <SwiperSlide key={index}>
              <Link to={getLink(item)} style={{ textDecoration: 'none' }} onClick={() => handleSelect(item)}>
                <Card sx={{ display: 'flex', backgroundColor: "#151E15", borderRadius: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <CardMedia
                      component="img"
                      sx={{ height: '100%', objectFit: 'cover' }}
                      image={image}
                      alt="Project image"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', padding: 2, gap: 1.5, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "#fff" }}>{item.name}</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#fff" }}>{item.type}</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                      {fields.map((field, idx) => (
                        <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#fff' }}>
                          <img src={field.icon} alt={field.label} style={{ width: 20, height: 20 }} />
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography component="div" sx={{ fontSize: "12px", fontWeight: 500 }}>{field.label}</Typography>
                            <Typography component="div" sx={{ fontSize: "18px", fontWeight: 600 }}>{item[field.key]}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Card>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
}

export const CreditCard: React.FC<CreditCardProps> = ({ data }) => {
  return (
    <Grid container spacing={2} sx={{ m: 3 }}>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          <Grid size={{ xs: item.xs, sm: item.sm }}>
            <Typography sx={{ color: "#666666", fontWeight: 600, fontSize: '16px' }}>
              {item.label}
            </Typography>
            <Typography sx={{ color: "#000", fontWeight: 500, fontSize: '20px' }}>
              {item.value}
            </Typography>
          </Grid>
          {index < data.length - 1 && !(data.length > 4 && index === 3) && (
            <Divider orientation="vertical" flexItem sx={{ mx: 2, borderColor: '#ccc' }} />
          )}
        </React.Fragment>
      ))}
    </Grid>
  );
};

export const ProjectSitesCarousel:React.FC<ProjectSitesCarouselProps> = ({ title, data, detailPage, handleSelectSite, siteAttributes }) => {
  return (
    <Box>
      <Typography sx={{ fontSize: "24px", fontWeight: 600, color: "#151E15", margin: "5px" }}>{title}</Typography>
      <Box sx={{ display: "flex", gap: 2, p: 1 }}>
        <Swiper
          navigation={true}
          modules={[Navigation]}
          slidesPerView={3}
          spaceBetween={30}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 10 },
            768: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 30 },
          }}
          style={{ width: "100%" }}
        >
          {data?.map((site, index) => (
            <SwiperSlide key={index}>
              <Link to={detailPage} style={{ textDecoration: "none" }} onClick={() => handleSelectSite(site)}>
                <Card sx={{ display: "flex", backgroundColor: "#151E15", borderRadius: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <CardMedia
                      component="img"
                      sx={{ height: "100%", objectFit: "cover" }}
                      image={BiodiversityMap}
                      alt="Site image"
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", padding: 2, gap: 1.5, flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "18px", color: "#fff" }}>{site.site_name}</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: "15px", color: "#fff" }}>{site.type}</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                      {siteAttributes.map((attr, i) => (
                        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 2, color: "#fff" }}>
                          <img src={attr.icon} alt={attr.label} style={{ width: 20, height: 20 }} />
                          <Box sx={{ display: "flex", flexDirection: "column" }}>
                            <Typography component="div" sx={{ fontSize: "12px", fontWeight: 500 }}>{attr.label}</Typography>
                            <Typography component="div" sx={{ fontSize: "18px", fontWeight: 600 }}>{site[attr.key]}</Typography>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Card>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>
    </Box>
  );
};