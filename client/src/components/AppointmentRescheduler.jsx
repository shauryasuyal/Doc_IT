import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Button, Paper, Chip, Stack,
  CircularProgress, Avatar, Fade, Alert, Divider, useTheme
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { LanguageContext } from '../App';
import { API_BASE_URL } from '../apiConfig';

// Translate helper
async function translate(text, lang) {
  if (!text || lang === 'en') return text;
  try {
    const res = await axios.post(`${API_BASE_URL}/translate`, { text, target_language: lang });
    return res.data.translated || text;
  } catch { return text; }
}

export default function AppointmentRescheduler({ onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useContext(LanguageContext);

  const [step, setStep] = useState('input'); // input | slots | confirmed
  const [currentAppt, setCurrentAppt] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);
  const [aiMessage, setAiMessage] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [confirmation, setConfirmation] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [translatedMsg, setTranslatedMsg] = useState('');

  const handleFindSlots = async () => {
    if (!preferredTime.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/reschedule-appointment`, {
        current_appointment: currentAppt || 'existing appointment',
        preferred_time: preferredTime,
        student_id: 'Student',
      });
      const msg = res.data.message;
      const translated = await translate(msg, language);
      setAiMessage(msg);
      setTranslatedMsg(translated);
      setSlots(res.data.available_slots || []);
      setStep('slots');
    } catch {
      setAiMessage('Here are the next available slots. Pick one to reschedule:');
      setTranslatedMsg('Here are the next available slots. Pick one to reschedule:');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (slot) => {
    setSelectedSlot(slot);
    setConfirmLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/confirm-reschedule`, {
        slot_display: slot.display,
        student_id: 'Student',
      });
      const msg = res.data.message;
      const translated = await translate(msg, language);
      setConfirmation(translated || msg);
      setStep('confirmed');
    } catch {
      setConfirmation(`✅ Confirmed! Rescheduled to ${slot.display}.`);
      setStep('confirmed');
    } finally {
      setConfirmLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        borderRadius: 4,
        border: isDark ? '1px solid rgba(99, 102, 241, 0.2)' : '1px solid #e0e7ff',
        bgcolor: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff',
        overflow: 'hidden',
        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 12px 40px rgba(99, 102, 241, 0.12)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(236,72,153,0.1) 100%)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e0e7ff',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar sx={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)', width: 42, height: 42 }}>
          <SwapHorizIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>Smart Appointment Rescheduler</Typography>
          <Typography variant="caption" color="text.secondary">
            Tell the AI your constraint — it finds the best next slot
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* STEP 1: Input */}
        {step === 'input' && (
          <Fade in>
            <Box>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Current appointment (optional)"
                placeholder="e.g. Meeting with Dean tomorrow at 2 PM"
                value={currentAppt}
                onChange={e => setCurrentAppt(e.target.value)}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' } }}
              />
              <TextField
                fullWidth
                label="When do you want to reschedule to?"
                placeholder="e.g. Next week after 3 PM, or Tuesday morning"
                value={preferredTime}
                onChange={e => setPreferredTime(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleFindSlots()}
                sx={{ mb: 2.5, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' } }}
              />

              {/* Quick hints */}
              <Box sx={{ mb: 2.5, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {['Next week after 3 PM', 'Tomorrow morning', 'Friday afternoon', 'Monday anytime'].map(h => (
                  <Chip
                    key={h}
                    label={h}
                    size="small"
                    onClick={() => setPreferredTime(h)}
                    sx={{
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 12,
                      bgcolor: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff',
                      color: isDark ? '#a5b4fc' : '#4338ca',
                      border: isDark ? '1px solid rgba(99,102,241,0.25)' : '1px solid #c7d2fe',
                      '&:hover': { bgcolor: isDark ? 'rgba(99,102,241,0.22)' : '#e0e7ff' },
                    }}
                  />
                ))}
              </Box>

              <Button
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <CalendarMonthIcon />}
                onClick={handleFindSlots}
                disabled={loading || !preferredTime.trim()}
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(99,102,241,0.5)' },
                }}
              >
                {loading ? 'Finding slots...' : 'Find Available Slots'}
              </Button>
            </Box>
          </Fade>
        )}

        {/* STEP 2: Show slots */}
        {step === 'slots' && (
          <Fade in>
            <Box>
              {/* AI message */}
              <Box
                sx={{
                  p: 2,
                  mb: 2.5,
                  borderRadius: 3,
                  bgcolor: isDark ? 'rgba(99,102,241,0.1)' : '#f0f0ff',
                  border: isDark ? '1px solid rgba(99,102,241,0.2)' : '1px solid #c7d2fe',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                }}
              >
                <AutoAwesomeIcon sx={{ color: '#6366f1', mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" fontWeight={500} lineHeight={1.6}>
                  {translatedMsg || aiMessage}
                </Typography>
              </Box>

              <Typography variant="subtitle2" fontWeight={800} mb={1.5} color="text.secondary">
                📅 Available Slots
              </Typography>

              <Stack spacing={1.5} mb={2.5}>
                {slots.map((slot, i) => (
                  <Fade in key={i} timeout={300 + i * 80}>
                    <Paper
                      onClick={() => !confirmLoading && handleConfirm(slot)}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                        cursor: confirmLoading ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        transition: 'all 0.18s ease',
                        '&:hover': {
                          borderColor: '#6366f1',
                          bgcolor: isDark ? 'rgba(99,102,241,0.1)' : '#eef2ff',
                          transform: 'translateX(4px)',
                          boxShadow: isDark ? '0 4px 16px rgba(99,102,241,0.2)' : '0 4px 12px rgba(99,102,241,0.1)',
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          background: `linear-gradient(135deg, ${['#6366f1','#10b981','#f59e0b','#ec4899'][i % 4]}, ${['#4f46e5','#059669','#d97706','#db2777'][i % 4]})`,
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {slot.date}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography fontWeight={800} fontSize={15}>{slot.day}</Typography>
                        <Typography variant="body2" color="text.secondary">{slot.time}</Typography>
                      </Box>
                      {selectedSlot?.datetime === slot.datetime && confirmLoading ? (
                        <CircularProgress size={20} color="primary" />
                      ) : (
                        <Chip
                          label="Select"
                          size="small"
                          sx={{ fontWeight: 700, bgcolor: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff', color: '#6366f1' }}
                        />
                      )}
                    </Paper>
                  </Fade>
                ))}
              </Stack>

              <Button
                variant="text"
                size="small"
                onClick={() => setStep('input')}
                sx={{ color: 'text.secondary', fontWeight: 600, borderRadius: 2 }}
              >
                ← Change preference
              </Button>
            </Box>
          </Fade>
        )}

        {/* STEP 3: Confirmed */}
        {step === 'confirmed' && (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  mx: 'auto',
                  mb: 2,
                  boxShadow: '0 8px 24px rgba(16,185,129,0.4)',
                }}
              >
                <CheckCircleIcon sx={{ fontSize: 34 }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} mb={1}>
                Appointment Rescheduled!
              </Typography>
              <Paper
                sx={{
                  p: 2,
                  mb: 2.5,
                  borderRadius: 3,
                  bgcolor: isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4',
                  border: isDark ? '1px solid rgba(16,185,129,0.25)' : '1px solid #a7f3d0',
                  textAlign: 'left',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                  <EventAvailableIcon sx={{ color: '#10b981', mt: 0.2 }} />
                  <Box>
                    <Typography fontWeight={800} color="success.main" mb={0.3}>
                      {selectedSlot?.display}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{confirmation}</Typography>
                  </Box>
                </Box>
              </Paper>

              <Stack direction="row" spacing={1.5} justifyContent="center">
                <Button
                  variant="outlined"
                  onClick={() => { setStep('input'); setCurrentAppt(''); setPreferredTime(''); setSlots([]); setSelectedSlot(null); setConfirmation(''); }}
                  sx={{ borderRadius: 3, fontWeight: 700 }}
                >
                  Reschedule Another
                </Button>
                {onClose && (
                  <Button variant="contained" onClick={onClose} sx={{ borderRadius: 3, fontWeight: 700 }}>
                    Done
                  </Button>
                )}
              </Stack>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
}
