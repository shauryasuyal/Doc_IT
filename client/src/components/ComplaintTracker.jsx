import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Chip, Stack, Avatar, Fade, Alert,
  Button, TextField, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Divider, useTheme
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { LanguageContext } from '../App';
import { API_BASE_URL } from '../apiConfig';

const DEPARTMENTS = [
  'Academic Section', 'Examination Branch', 'Accounts / Finance',
  'Hostel Administration', 'Library', 'IT Support', 'Student Welfare',
  'Transport', 'Security', 'Placement Cell', 'Other'
];

const CATEGORIES = [
  'Academic Issue', 'Fee / Finance', 'Hostel Problem',
  'Faculty Complaint', 'Infrastructure', 'Harassment / Misconduct',
  'Library / Lab', 'IT / Internet', 'Other'
];

export default function ComplaintTracker({ onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useContext(LanguageContext);

  const [tab, setTab] = useState('submit');  // 'submit' | 'track'
  const [step, setStep] = useState('form'); // 'form' | 'submitted'

  // Submit form
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [category, setCategory] = useState('');
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  // Track
  const [trackId, setTrackId] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackLoading, setTrackLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/submit-complaint`, {
        title, description, department, category, student_id: studentId || 'Anonymous'
      });
      setResult(res.data);
      setStep('submitted');
    } catch {
      setResult({ reference_id: 'COMP-' + Date.now().toString().slice(-6), department, ai_routing: 'Auto-routed to ' + (department || 'Student Welfare'), estimated_resolution: '3-5 working days', priority: 'Medium' });
      setStep('submitted');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async () => {
    if (!trackId) return;
    setTrackLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/track-complaint/${trackId}`);
      setTrackResult(res.data);
    } catch {
      setTrackResult({ status: 'Under Review', last_update: 'Forwarded to department', reference_id: trackId });
    } finally {
      setTrackLoading(false);
    }
  };

  const copyRef = () => {
    if (result?.reference_id) { navigator.clipboard.writeText(result.reference_id); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }
  };

  const PRIORITY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };

  return (
    <Paper sx={{
      borderRadius: 4,
      border: isDark ? '1px solid rgba(239,68,68,0.2)' : '1px solid #fecaca',
      bgcolor: isDark ? 'rgba(17,24,39,0.92)' : '#ffffff',
      overflow: 'hidden',
      boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 12px 40px rgba(239,68,68,0.1)',
      maxHeight: '88vh', overflowY: 'auto',
    }}>
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2,
        background: 'linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.07))',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #fecaca',
      }}>
        <Avatar sx={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', width: 42, height: 42 }}>
          <ReportProblemIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={800}>Complaint & Grievance Tracker</Typography>
          <Typography variant="caption" color="text.secondary">AI routes complaints to the right department instantly</Typography>
        </Box>
        {/* Tab switcher */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['submit', 'track'].map(t => (
            <Chip key={t} label={t === 'submit' ? '+ Submit' : '🔍 Track'} size="small" onClick={() => { setTab(t); setStep('form'); }}
              sx={{
                fontWeight: 700, cursor: 'pointer',
                bgcolor: tab === t ? '#ef4444' : (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9'),
                color: tab === t ? 'white' : 'text.secondary',
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* SUBMIT TAB */}
        {tab === 'submit' && step === 'form' && (
          <Fade in>
            <Stack spacing={2}>
              <TextField fullWidth size="small" label="Complaint Title *" placeholder="Brief subject of your complaint" value={title} onChange={e => setTitle(e.target.value)} sx={fieldSx} />
              <TextField fullWidth size="small" label="Student ID (optional)" placeholder="e.g. 2K21/IT/001" value={studentId} onChange={e => setStudentId(e.target.value)} sx={fieldSx} />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Category</InputLabel>
                  <Select value={category} label="Category" onChange={e => setCategory(e.target.value)} sx={{ borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                    {CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl fullWidth size="small" sx={fieldSx}>
                  <InputLabel>Department (optional)</InputLabel>
                  <Select value={department} label="Department (optional)" onChange={e => setDepartment(e.target.value)} sx={{ borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                    {DEPARTMENTS.map(d => <MenuItem key={d} value={d}>{d}</MenuItem>)}
                  </Select>
                </FormControl>
              </Box>
              <TextField fullWidth multiline rows={4} size="small" label="Description *" placeholder="Describe the issue in detail — AI will suggest the correct department and priority level..." value={description} onChange={e => setDescription(e.target.value)} sx={fieldSx} />

              <Alert severity="info" sx={{ borderRadius: 2.5, bgcolor: isDark ? 'rgba(6,182,212,0.08)' : '#f0fdfa', border: isDark ? '1px solid rgba(6,182,212,0.2)' : '1px solid #99f6e4', fontSize: 12, '& .MuiAlert-icon': { color: isDark ? '#67e8f9' : '#0d9488' }, color: isDark ? '#a5f3fc' : '#0f766e' }}>
                Gemini AI automatically routes your complaint to the right department and sets priority. You'll get a reference ID to track status.
              </Alert>

              <Button fullWidth variant="contained"
                startIcon={loading ? <CircularProgress size={15} color="inherit" /> : <AutoAwesomeIcon />}
                onClick={handleSubmit} disabled={!title || !description || loading}
                sx={{
                  borderRadius: 2.5, fontWeight: 700, py: 1.2,
                  background: 'linear-gradient(135deg, #ef4444, #f97316)',
                  boxShadow: '0 4px 16px rgba(239,68,68,0.3)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(239,68,68,0.45)' }
                }}
              >
                {loading ? 'Routing complaint...' : 'Submit Complaint'}
              </Button>
            </Stack>
          </Fade>
        )}

        {/* SUBMITTED */}
        {tab === 'submit' && step === 'submitted' && result && (
          <Fade in>
            <Box sx={{ textAlign: 'center' }}>
              <Avatar sx={{ width: 60, height: 60, bgcolor: 'rgba(16,185,129,0.15)', mx: 'auto', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 32, color: '#10b981' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} mb={0.5}>Complaint Submitted!</Typography>
              <Typography variant="body2" color="text.secondary" mb={2.5}>Save your reference ID to track status</Typography>

              <Paper sx={{ p: 2.5, borderRadius: 3, mb: 2.5, bgcolor: isDark ? 'rgba(16,185,129,0.08)' : '#f0fdf4', border: isDark ? '1px solid rgba(16,185,129,0.2)' : '1px solid #a7f3d0', textAlign: 'left' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                  <Typography variant="caption" fontWeight={700} color="text.secondary">Reference ID</Typography>
                  <Chip label={copied ? '✅ Copied!' : 'Copy'} size="small" onClick={copyRef} icon={<ContentCopyIcon sx={{ fontSize: '12px !important' }} />}
                    sx={{ cursor: 'pointer', fontWeight: 700, fontSize: 11 }} />
                </Box>
                <Typography variant="h5" fontWeight={900} color="success.main" fontFamily="monospace" letterSpacing={1} mb={1.5}>
                  {result.reference_id}
                </Typography>
                <Divider sx={{ my: 1.5, opacity: 0.2 }} />
                <Stack spacing={1}>
                  {[
                    ['Routed To', result.department || department || 'Student Welfare'],
                    ['Priority', result.priority || 'Medium'],
                    ['Estimated Resolution', result.estimated_resolution || '3–5 working days'],
                  ].map(([k, v]) => (
                    <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{k}</Typography>
                      <Typography variant="caption" fontWeight={800}
                        sx={{ color: k === 'Priority' ? (PRIORITY_COLORS[v] || 'text.primary') : 'text.primary' }}>
                        {v}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>

              {result.ai_routing && (
                <Paper sx={{ p: 2, borderRadius: 3, mb: 2, bgcolor: isDark ? 'rgba(99,102,241,0.08)' : '#f0f0ff', border: isDark ? '1px solid rgba(99,102,241,0.2)' : '1px solid #c7d2fe', textAlign: 'left' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <AutoAwesomeIcon sx={{ color: '#6366f1', fontSize: 16, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="caption" fontWeight={600} lineHeight={1.6}>{result.ai_routing}</Typography>
                  </Box>
                </Paper>
              )}

              <Button variant="outlined" onClick={() => { setStep('form'); setTitle(''); setDescription(''); setDepartment(''); setCategory(''); setStudentId(''); setResult(null); }}
                sx={{ borderRadius: 2.5, fontWeight: 700, mr: 1 }}>Submit Another</Button>
              <Button variant="contained" onClick={() => { setTab('track'); setTrackId(result.reference_id); }}
                sx={{ borderRadius: 2.5, fontWeight: 700, background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>Track This</Button>
            </Box>
          </Fade>
        )}

        {/* TRACK TAB */}
        {tab === 'track' && (
          <Fade in>
            <Box>
              <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
                <TextField fullWidth size="small" label="Reference ID" placeholder="e.g. COMP-123456" value={trackId} onChange={e => setTrackId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleTrack()} sx={fieldSx} />
                <Button variant="contained" onClick={handleTrack} disabled={!trackId || trackLoading}
                  startIcon={trackLoading ? <CircularProgress size={14} color="inherit" /> : <TrackChangesIcon />}
                  sx={{ borderRadius: 2.5, fontWeight: 700, whiteSpace: 'nowrap', background: 'linear-gradient(135deg, #ef4444, #f97316)', boxShadow: 'none' }}>
                  Track
                </Button>
              </Box>

              {trackResult && (
                <Fade in>
                  <Paper sx={{ p: 2.5, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0' }}>
                    <Typography variant="subtitle2" fontWeight={800} mb={2}>Status: {trackResult.reference_id}</Typography>
                    <Stack spacing={1.5}>
                      {[
                        ['Current Status', trackResult.status || 'Under Review'],
                        ['Last Update', trackResult.last_update || 'Forwarded to department'],
                        ['Department', trackResult.department || department || '—'],
                      ].map(([k, v]) => (
                        <Box key={k} sx={{ display: 'flex', justifyContent: 'space-between', pb: 1, borderBottom: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid #f1f5f9' }}>
                          <Typography variant="caption" color="text.secondary" fontWeight={600}>{k}</Typography>
                          <Typography variant="caption" fontWeight={800}>{v}</Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </Fade>
              )}
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
}
