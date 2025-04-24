import ReactWordcloud from 'react-wordcloud';
import { Paper, Typography } from '@mui/material';
import { mockWordFrequency } from '../data/mockVictimStatements';

const options = {
  colors: ['#1976D2', '#2196F3', '#64B5F6', '#90CAF9', '#BBDEFB'],
  enableTooltip: true,
  deterministic: true,
  fontFamily: 'Arial',
  fontSizes: [15, 60] as [number, number],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [0, 90] as [number, number],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 1000
};

export default function WordCloudVisualization() {
  return (
    <Paper sx={{ p: 2, height: '400px' }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Common Words from Victim Reports
      </Typography>
      <div style={{ width: '100%', height: 'calc(100% - 40px)' }}>
        <ReactWordcloud words={mockWordFrequency} options={options} />
      </div>
    </Paper>
  );
} 