import { AppBar, Toolbar, Typography, Button, IconButton, Box, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useState, useEffect } from 'react';

interface NavbarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.altKey && event.key.toLowerCase() === 'm') {
        onViewChange('Mission Control');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [onViewChange]);

  const menuItems = ['Intake Form', 'Mission Control'];

  const handleMenuClick = (view: string) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/red-cross-logo.svg" 
              alt="Red Cross Logo" 
              style={{ height: '40px', marginRight: '12px' }}
            />
            {/* <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'black',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              RapidVoice
            </Typography> */}
          </Box>

          {isMobile ? (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileMenuOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2 }}>
              {menuItems.map((item) => (
                <Button
                  key={item}
                  color="inherit"
                  onClick={() => handleMenuClick(item)}
                  sx={{
                    fontWeight: currentView === item ? 700 : 400,
                    borderBottom: currentView === item ? '2px solid #E31837' : 'none',
                    borderRadius: 0,
                    px: 2
                  }}
                >
                  {item}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <List sx={{ width: 250 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item}
              onClick={() => handleMenuClick(item)}
              sx={{
                backgroundColor: currentView === item ? 'rgba(227, 24, 55, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(227, 24, 55, 0.05)'
                },
                cursor: 'pointer'
              }}
            >
              <ListItemText 
                primary={item}
                sx={{
                  '& .MuiTypography-root': {
                    color: currentView === item ? '#E31837' : 'inherit',
                    fontWeight: currentView === item ? 700 : 400
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      {/* Add toolbar spacing to prevent content from going under AppBar */}
      <Toolbar />
    </>
  );
} 