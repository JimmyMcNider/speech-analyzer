import { useState, useEffect, useCallback } from 'react';
import { ThemeProvider, Box, Container, Paper, Typography, IconButton, Button, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SendIcon from '@mui/icons-material/Send';
import { theme } from './theme';
import { analyzeSpeech, DisasterIntake, getMissingRequiredFields, REQUIRED_FIELDS } from './services/gemini';
import './App.css';
import Navbar from './components/Navbar';
import MissionControl from './components/MissionControl';
import IntakeForm from './components/IntakeForm';

interface AudioData {
  timestamp: number;
  volume: number;
}

const FIELD_LABELS: Record<string, string> = {
  first_name: 'First Name',
  last_name: 'Last Name',
  date_of_birth: 'Date of Birth',
  phone_number: 'Phone Number',
  email_address: 'Email Address',
  primary_language: 'Primary Language',
  affected_address: 'Affected Address',
  type_of_residence: 'Type of Residence',
  ownership_status: 'Ownership Status',
  household_members: 'Number of Household Members',
  number_of_pets: 'Number of Pets',
  type_of_pets: 'Type of Pets',
  type_of_disaster: 'Type of Disaster',
  incident_date: 'Incident Date',
  incident_time: 'Incident Time',
  damage_description: 'Damage Description',
  is_home_habitable: 'Is Home Habitable',
  insurance_status: 'Insurance Status',
  'needs_assessment.shelter_needed': 'Needs Shelter',
  'needs_assessment.food_water_needed': 'Needs Food/Water',
  'needs_assessment.clothing_needed': 'Needs Clothing',
  'needs_assessment.health_services_needed': 'Needs Health Services',
  'needs_assessment.medication_needed': 'Needs Medication',
  'needs_assessment.baby_supplies_needed': 'Needs Baby Supplies',
  has_disabled_members: 'Has Disabled Members'
};

function App() {
  const [currentView, setCurrentView] = useState('Intake Form');

  return (
    <ThemeProvider theme={theme}>
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {currentView === 'Mission Control' ? (
          <MissionControl />
        ) : (
          <IntakeForm />
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
