import React from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const drawerWidth = 300;

const MainComponent = styled('main')({
  flexGrow: 1,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column'
});

const Main = styled(MainComponent, { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  minHeight: '89px !important',
  justifyContent: 'flex-end',
}));

interface MainComponentLayoutProps {
  mainContent: React.ReactNode;
  open?: boolean | undefined;
}

export const MainComponentLayout = ({
  mainContent,
  open
}: MainComponentLayoutProps) => {

  return (
    <Main open={open}>
      <Box p={3} flexGrow={1}>
        <DrawerHeader />
        {mainContent}
      </Box>
    </Main>
  );
};
