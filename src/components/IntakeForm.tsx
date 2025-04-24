import { useState, useEffect, useCallback } from 'react';
import { Box, Paper, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import SendIcon from '@mui/icons-material/Send';
import { analyzeSpeech, DisasterIntake, getMissingRequiredFields } from '../services/gemini';

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

export default function IntakeForm() {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [error, setError] = useState<string>('');
  const [transcription, setTranscription] = useState<string>('');
  const [analysis, setAnalysis] = useState<Partial<DisasterIntake>>({});
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [intakeId] = useState(`ID: ${Math.floor(10000 + Math.random() * 90000)}`);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const setupSpeechRecognition = useCallback(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscription(prev => prev + ' ' + transcript);
      };
      return recognition;
    }
    return null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 256;
      source.connect(analyzer);

      const recognition = setupSpeechRecognition();
      if (recognition) {
        recognition.start();
        setSpeechRecognition(recognition);
      }

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      setError('Error accessing microphone: ' + err);
    }
  }, [setupSpeechRecognition]);

  const stopRecording = useCallback(async () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);

      if (speechRecognition) {
        speechRecognition.stop();
      }

      if (transcription) {
        try {
          const result = await analyzeSpeech(transcription);
          setAnalysis(prev => ({ ...prev, ...result }));
          const missing = getMissingRequiredFields({ ...analysis, ...result });
          setMissingFields(missing);
        } catch (err) {
          setError('Error analyzing speech: ' + err);
        }
      }
    }
  }, [mediaRecorder, speechRecognition, transcription, analysis]);

  const handleSubmit = () => {
    console.log('Submitting intake form:', analysis);
    setShowSubmitDialog(true);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
      if (speechRecognition) {
        speechRecognition.stop();
      }
    };
  }, [mediaRecorder, speechRecognition]);

  const renderFieldValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return value;
  };

  return (
    <>
      <Box className="intake-header">
        <img src="/red-cross-logo.svg" alt="Red Cross Logo" className="logo" />
        <Typography variant="h4" component="h1" gutterBottom>
          RapidVoice
        </Typography>
        <Typography className="intake-id">
          Intake {intakeId}
        </Typography>
      </Box>

      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <button
            className={`record-button ${isRecording ? 'recording' : ''}`}
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? <StopIcon className="record-icon" /> : <MicIcon className="record-icon" />}
          </button>
          <Typography variant="h6" sx={{ mt: 2 }}>
            {isRecording ? 'Tap to stop' : 'Tap to record'}
          </Typography>
          
          {missingFields.length > 0 && (
            <Box sx={{ mt: 2, textAlign: 'left', width: '100%' }}>
              <Typography variant="subtitle1" color="error">
                Required information missing:
              </Typography>
              <List dense>
                {missingFields.map((field) => (
                  <ListItem key={field}>
                    <ListItemIcon>
                      <ErrorIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary={FIELD_LABELS[field]} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {transcription && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: 'grey.100' }}>
            <Typography variant="body1">
              {transcription}
            </Typography>
          </Paper>
        )}

        {Object.keys(analysis).length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Information Collected
            </Typography>
            
            <List>
              {Object.entries(analysis).map(([key, value]) => {
                if (!value || (typeof value === 'object' && Object.keys(value).length === 0)) return null;
                
                if (typeof value === 'object' && !Array.isArray(value)) {
                  return Object.entries(value).map(([subKey, subValue]) => {
                    if (!subValue) return null;
                    const fullKey = `${key}.${subKey}`;
                    return (
                      <ListItem key={fullKey}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={FIELD_LABELS[fullKey]}
                          secondary={renderFieldValue(subValue)}
                        />
                      </ListItem>
                    );
                  });
                }

                return (
                  <ListItem key={key}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={FIELD_LABELS[key]}
                      secondary={renderFieldValue(value)}
                    />
                  </ListItem>
                );
              })}
            </List>

            {missingFields.length === 0 && (
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                >
                  Submit Intake Form
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Paper>

      <Dialog open={showSubmitDialog} onClose={() => setShowSubmitDialog(false)}>
        <DialogTitle>Intake Form Submitted</DialogTitle>
        <DialogContent>
          <Typography>
            The intake form has been successfully submitted with ID: {intakeId}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSubmitDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
} 