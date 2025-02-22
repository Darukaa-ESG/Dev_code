import React from 'react'
import { Box, Typography, Grid2, Card } from '@mui/material'
import { ProjectDetailComponentProps, SiteCardProps, SiteDetailCardProps } from '../../Interface/Index';

export const ProjectDetailComponent: React.FC<ProjectDetailComponentProps> = ({ id, title,
  subTitle,
  startDateTitle,
  startDate,
  endDateTitle,
  endDate,
  detailTitle,
  details,
  mapTitle,
  children,
  icon,
  projectType,
  sdg,
  creditPeriod,
  totalReduction,
  totalArea
}) => {
  return (
    <Box>
      <Box my={3} display='flex' justifyContent='space-between'>
        <Box>
          <Typography sx={{ fontSize: '32px', fontWeight: 600 }}>{title}</Typography>
          <Box sx={{ display: 'flex' }}>
            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: "#ffb400" }}>{subTitle}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {icon && typeof icon === 'string' && (
                <Box sx={{ ml: 1 }}>
                  <img
                    src={icon}
                    alt="icon"
                    style={{ width: '20px', height: '25px', objectFit: 'contain' }}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <Box>
          <Box>
            <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 2, flexWrap: 'wrap', maxWidth: '380px' }}>
              {sdg?.map((i: string, index: number) => (
                <img
                  key={index}
                  src={i}
                  alt="icon"
                  style={{
                    width: '60px',
                    height: '60px',
                    objectFit: 'contain',
                    borderRadius: '4px',
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Grid2 container rowSpacing={2} columnSpacing={{ xs: 2, sm: 3, md: 2 }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {'Project Id'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {id}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {'Project Type'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {projectType}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {'Total Area'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {totalArea}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {'Total Emission Reduction'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {totalReduction}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {'Credit Period'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {creditPeriod}
            </Typography>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {startDateTitle}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {startDate}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {endDateTitle}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {endDate}
            </Typography>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography sx={{ color: "#666666", fontWeight: 500, fontSize: '16px' }}>
              {'Project Developer'}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '20px' }}>
              {detailTitle}
            </Typography>
          </Grid2>
        </Grid2>
      </Box>
      <Box my={3}>
        <Typography sx={{ fontSize: '17px', fontWeight: 500, color: "#666666", textAlign: 'justify' }}>{details}</Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography sx={{ fontSize: '22px', fontWeight: 600, color: '#151E15' }}>{mapTitle}</Typography>
        {children}
      </Box>
    </Box>
  )
}

export const SiteDetailCard: React.FC<SiteDetailCardProps> = ({ siteTitle, siteDetail }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography sx={{ color: '#151E15', fontWeight: 600, fontSize: "24px" }}>{siteTitle}</Typography>
      <Typography sx={{ color: '#666666', fontWeight: 400, fontSize: "16px" }}>{siteDetail}</Typography>
    </Box>
  )
};

export const SiteCard: React.FC<SiteCardProps> = ({ title, amount, icon }) => {
  return (
    <Card sx={{
      display: 'flex',
      alignItems: 'center',
      padding: 2,
      borderRadius: 2,
      boxShadow: 1,
      backgroundColor: '#fff',
      '&:hover': {
        boxShadow: 3,
      },
      maxHeight: '500px'

    }}>
      {/* Icon section */}
      <Box sx={{ marginRight: 2, display: 'flex', alignItems: 'center' }}>
        {icon && (
          <img src={icon} alt={`${title} Icon`} width={50} height={50} />
        )}
      </Box>

      {/* Title and Amount Section */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: '18px',
            fontWeight: 700,
            color: "#666666",
            textAlign: 'left',
            maxHeight: "180px"
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="h5"
          sx={{
            fontSize: '17px',
            fontWeight: 600,
            color: "#151E15",
            textAlign: 'left',
            marginBottom: 1,
            maxHeight: "180px"
          }}
        >
          {amount}
        </Typography>
      </Box>
    </Card>
  )
}
