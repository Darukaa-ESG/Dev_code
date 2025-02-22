import { AppBar, Box, Container, Menu, MenuItem, Toolbar } from '@mui/material'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Logo from '../../../resources/images/logo-black 1.png';
import { sideNavs } from '../../../constants';
import ProjectListData from '../../../db.json'

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [projectSite] = useState(ProjectListData.ProjectSite);
    const [projectCarbonSite] = useState(ProjectListData.CarbonCredit);
    const [projectEnvSite] = useState(ProjectListData.Environmental);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectSite = (site:  { site_name: string }) => {
        localStorage.setItem('SelectedDropDownSite', JSON.stringify(site))
        navigate('/biodiversity-analysis-detail')
        handleClose();
    };
    const handleSelectCarbonSite = (site:  { site_name: string }) => {
        localStorage.setItem('SelectedDropDownCarbonSite', JSON.stringify(site))
        navigate('/carbonanalysis-analysis-detail')
        handleClose();
    };
    const handleSelectEnvSite = (site:  { site_name: string }) => {
        localStorage.setItem('SelectedDropDownEnvSite', JSON.stringify(site))
        navigate('/environmentalreport-analysis-detail')
        handleClose();
    };

    return (
        <AppBar position="fixed" color="inherit" className="header">
            <Container maxWidth={false} sx={{ maxWidth: '1736px' }}>
                <Toolbar
                    disableGutters
                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Box display="flex" alignSelf="stretch">
                        <Link to="/" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                            <Box className="logo" display="flex" alignItems="center" height="100%">
                                <img src={Logo} alt="Logo" />
                            </Box>
                        </Link>
                    </Box>

                    {location.pathname === '/' ? null : (
                        <Box
                            className="header-navlinks"
                            sx={{ display: { xs: 'block', sm: 'none', md: 'block' } }}
                        >
                            <Box
                                className="top-navs"
                                sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}
                            >
                                {sideNavs.map((item) => (
                                    <Box key={item.text}>
                                        <Link
                                            to={item.path}
                                            style={{
                                                fontSize: '14px',
                                                fontWeight: 500,

                                                textDecoration: 'none',
                                                margin: '10px',
                                            }}
                                            className={
                                                (location.pathname.startsWith('/biodiversity') &&
                                                    item.path === '/biodiversity') ||
                                                    (location.pathname.startsWith('/carbonanalysis') &&
                                                        item.path === '/carbonanalysis') ||
                                                    (location.pathname.startsWith('/environmentalreport') &&
                                                        item.path === '/environmentalreport')
                                                    ? 'active-link'
                                                    : location.pathname === item.path
                                                        ? 'active-link'
                                                        : ''
                                            }
                                        >
                                            {item.text}
                                        </Link>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Toolbar>
            </Container>

            {location.pathname.startsWith('/biodiversity') && (
                <Box className="sub-header">
                    <Box sx={{ m: '15px' }}>
                        <Link
                            to="/biodiversity"
                            style={{
                                fontSize: '14px',
                                fontWeight: 500,

                                textDecoration: 'none',
                            }}
                            className={
                                location.pathname === '/biodiversity'
                                    ? 'sub-active-link'
                                    : 'un-active-link'
                            }
                        >
                            Dashboard
                        </Link>

                        {/* Analysis with Dropdown Menu */}
                        <Box
                            sx={{ display: 'inline-block', position: 'relative' }}
                            onMouseEnter={handleOpenMenu}
                            onMouseLeave={handleClose}
                        >
                            <Link
                                to="/biodiversity-analysis-detail"
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 500,

                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                }}
                                className={
                                    location.pathname === '/biodiversity-analysis-detail'
                                        ? 'sub-active-link'
                                        : 'un-active-link'
                                }
                            >
                                Analysis
                            </Link>

                            {/* Dropdown Menu */}
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                sx={{
                                    mt: 1,
                                    '& .MuiMenuItem-root': {
                                        fontSize: '14px',
                                        fontWeight: 500,

                                        px: 2,
                                        py: 1,
                                    },
                                }}
                            >
                                {projectSite &&
                                    projectSite[0][0].sites.map((site: { site_name: string }, index: number) => (
                                        <MenuItem
                                            key={index}
                                            onClick={() => handleSelectSite(site)}
                                        >
                                            {site.site_name}
                                        </MenuItem>
                                    ))}
                            </Menu>
                        </Box>

                        <Link
                            to="/biodiversitycredits"
                            style={{
                                fontSize: '14px',
                                fontWeight: 500,

                                textDecoration: 'none',
                            }}
                            className={
                                location.pathname === '/biodiversitycredits'
                                    ? 'sub-active-link'
                                    : 'un-active-link'
                            }
                        >
                            Credits
                        </Link>
                    </Box>
                </Box>
            )}
            {location.pathname.startsWith('/carbonanalysis') ? (
                <Box className='sub-header'>
                    <Box sx={{ m: '15px' }}>
                        <Link
                            to='/carbonanalysis'
                            style={{
                                fontSize: "14px", fontWeight: 500,
                                // fontFamily: "Poppins, sans-serif", 
                                textDecoration: 'none'
                            }}
                            className={
                                location.pathname === '/carbonanalysis'
                                    ? 'sub-active-link'
                                    : 'un-active-link'
                            }
                        >
                            Dashboard
                        </Link>
                        <Box
                            sx={{ display: 'inline-block', position: 'relative' }}
                            onMouseEnter={handleOpenMenu}
                            onMouseLeave={handleClose}
                        >
                            <Link
                                to='/carbonanalysis-analysis-detail'
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    textDecoration: 'none'
                                }}
                                className={location.pathname === '/carbonanalysis-analysis-detail' ? 'sub-active-link' : 'un-active-link'}
                                onClick={handleOpenMenu}
                            >
                                Analysis
                            </Link>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                sx={{
                                    mt: 1,
                                    '& .MuiMenuItem-root': {
                                        fontSize: '14px',
                                        fontWeight: 500,

                                        px: 2,
                                        py: 1,
                                    },
                                }}
                            >
                                {projectCarbonSite && projectCarbonSite[0].sites.map((site:{ site_name: string }, index: number) => (
                                    <MenuItem
                                        key={index}
                                        onClick={() => handleSelectCarbonSite(site)} // Set the selected site
                                    >
                                        {site.site_name}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Link
                            to='/carbonanalysiscredits'
                            style={{
                                fontSize: "14px", fontWeight: 500,
                                //  fontFamily: "Poppins, sans-serif",
                                textDecoration: 'none'
                            }}
                            className={location.pathname === '/carbonanalysiscredits' ? 'sub-active-link' : 'un-active-link'}
                        >
                            Credits
                        </Link>
                    </Box>
                </Box>
            ) : null}
            {location.pathname.startsWith('/environmentalreport') ? (
                <Box className='sub-header'>
                    <Box sx={{ m: '15px' }}>
                        <Link
                            to='/environmentalreport'
                            style={{
                                fontSize: "14px", fontWeight: 500,
                                // fontFamily: "Poppins, sans-serif", 
                                textDecoration: 'none'
                            }}
                            className={
                                location.pathname === '/environmentalreport'
                                    ? 'sub-active-link'
                                    : 'un-active-link'
                            }
                        >
                            Dashboard
                        </Link>
                        <Box
                            sx={{ display: 'inline-block', position: 'relative' }}
                            onMouseEnter={handleOpenMenu}
                            onMouseLeave={handleClose}
                        >
                            <Link
                                to="/environmentalreport-analysis-detail"
                                style={{
                                    fontSize: '14px',
                                    fontWeight: 500,

                                    cursor: 'pointer',
                                    textDecoration: 'none',
                                }}
                                className={
                                    location.pathname === '/environmentalreport-analysis-detail'
                                        ? 'sub-active-link'
                                        : 'un-active-link'
                                }
                            >
                                Analysis
                            </Link>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                sx={{
                                    mt: 1,
                                    '& .MuiMenuItem-root': {
                                        fontSize: '14px',
                                        fontWeight: 500,

                                        px: 2,
                                        py: 1,
                                    },
                                }}
                            >
                                {projectEnvSite &&
                                    projectEnvSite[0].sites.map((site: { site_name: string }, index: number) => (
                                        <MenuItem
                                            key={index}
                                            onClick={() => handleSelectEnvSite(site)}
                                        >
                                            {site.site_name}
                                        </MenuItem>
                                    ))}
                            </Menu>
                        </Box>
                    </Box>
                </Box>
            ) : null}
        </AppBar>
    )
}

export default Sidebar