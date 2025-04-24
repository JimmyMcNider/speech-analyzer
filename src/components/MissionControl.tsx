import { Box, Card, CardContent, Typography, Paper, useTheme, Chip, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import type { Theme } from '@mui/material/styles';
import {
  PeopleAlt as PeopleIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  LocalHospital as MedicalIcon
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, DivIcon } from 'leaflet';
import { mockIncidents, Incident, Victim } from '../data/mockIncidents';
import { useMemo } from 'react';
import WordCloudVisualization from './WordCloudVisualization';

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

const getVictimIcon = (victim: Victim) => {
  let color;
  switch (victim.condition) {
    case 'critical':
      color = 'rgba(227, 24, 55, 0.5)'; // Red with 50% opacity
      break;
    case 'stable':
      color = 'rgba(46, 125, 50, 0.5)'; // Green with 50% opacity
      break;
    case 'minor':
      color = 'rgba(251, 140, 0, 0.5)'; // Orange with 50% opacity
      break;
    default:
      color = 'rgba(25, 118, 210, 0.5)'; // Blue with 50% opacity
  }
  
  return new DivIcon({
    html: `<div style="
      background-color: ${color};
      border: 2px solid ${color.replace('0.5', '0.8')};
      border-radius: 50%;
      width: 100%;
      height: 100%;
    "></div>`,
    className: 'victim-marker',
    iconSize: [16, 16],
    iconAnchor: [8, 8]
  });
};

export default function MissionControl() {
  const theme = useTheme<Theme>();

  const stats = useMemo(() => ({
    totalVictims: mockIncidents.reduce((sum, inc) => sum + inc.totalVictims, 0),
    criticalCases: mockIncidents.reduce((sum, inc) => sum + inc.criticalCases, 0),
    locations: mockIncidents.length,
    medicalNeeds: mockIncidents.filter(inc => 
      inc.requiredResources.some(r => r.toLowerCase().includes('medical'))
    ).length
  }), []);

  const allVictims = useMemo(() => 
    mockIncidents.flatMap(incident => 
      incident.victims.map(victim => ({
        ...victim,
        incidentId: incident.id,
        incidentType: incident.type,
        incidentAddress: incident.address
      }))
    ), []);

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
            title="Counties Involved"
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

        <Grid xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 2,
              height: '600px'
            }}
          >
            <MapContainer 
              center={[27.9506, -82.4572]} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {allVictims.map(victim => (
                <Marker
                  key={victim.id}
                  position={[victim.location.lat, victim.location.lng]}
                  icon={getVictimIcon(victim)}
                >
                  <Popup>
                    <Box sx={{ minWidth: 200 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {victim.name}
                      </Typography>
                      <Stack spacing={1}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Condition:
                          </Typography>
                          <Chip
                            label={victim.condition.toUpperCase()}
                            color={
                              victim.condition === 'critical' ? 'error' :
                              victim.condition === 'stable' ? 'success' : 'warning'
                            }
                            size="small"
                          />
                        </Box>
                        {victim.age && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Age:
                            </Typography>
                            <Typography variant="body1">
                              {victim.age}
                            </Typography>
                          </Box>
                        )}
                        {victim.medicalNeeds && victim.medicalNeeds.length > 0 && (
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Medical Needs:
                            </Typography>
                            <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                              {victim.medicalNeeds.map((need, index) => (
                                <Chip
                                  key={index}
                                  label={need}
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              ))}
                            </Stack>
                          </Box>
                        )}
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Location:
                          </Typography>
                          <Typography variant="body1">
                            {victim.incidentAddress}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Incident Type:
                          </Typography>
                          <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
                            {victim.incidentType}
                          </Typography>
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Reported: {new Date(victim.reportTime).toLocaleString()}
                        </Typography>
                      </Stack>
                    </Box>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        </Grid>

        <Grid xs={12} md={4}>
          <WordCloudVisualization />
        </Grid>
      </Grid>
    </Box>
  );
} 