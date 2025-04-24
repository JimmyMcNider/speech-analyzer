import { Box, Card, CardContent, Typography, Paper, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import type { Theme } from '@mui/material/styles';
import {
  PeopleAlt as PeopleIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  LocalHospital as MedicalIcon
} from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => (
  <Card elevation={2}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            borderRadius: '50%',
            p: 1,
            mr: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </Box>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

export default function MissionControl() {
  const theme = useTheme<Theme>();

  // This would be replaced with real data from your application state
  const stats = {
    totalVictims: 247,
    criticalCases: 42,
    locations: 8,
    medicalNeeds: 156
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Mission Control
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Victims"
            value={stats.totalVictims}
            icon={<PeopleIcon sx={{ color: theme.palette.primary.main }} />}
            color={theme.palette.primary.main}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Critical Cases"
            value={stats.criticalCases}
            icon={<WarningIcon sx={{ color: '#E31837' }} />}
            color="#E31837"
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Locations"
            value={stats.locations}
            icon={<LocationIcon sx={{ color: theme.palette.success.main }} />}
            color={theme.palette.success.main}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Medical Needs"
            value={stats.medicalNeeds}
            icon={<MedicalIcon sx={{ color: theme.palette.info.main }} />}
            color={theme.palette.info.main}
          />
        </Grid>

        {/* Placeholder for future data visualizations */}
        <Grid xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              height: '400px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f5f5f5'
            }}
          >
            <Typography variant="h6" color="text.secondary">
              Data visualization components will be added here
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
} 