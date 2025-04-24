import { useState } from 'react';
import { ThemeProvider, Container } from '@mui/material';
import { theme } from './theme';
import Navbar from './components/Navbar';
import MissionControl from './components/MissionControl';
import IntakeForm from './components/IntakeForm';
import './App.css';

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
