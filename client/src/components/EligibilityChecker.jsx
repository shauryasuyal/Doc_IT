import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box, Typography, TextField, Button, Paper, Chip, Stack, Grid,
  CircularProgress, Avatar, Fade, Alert, Divider, Collapse,
  LinearProgress, MenuItem, Select, FormControl, InputLabel,
  Accordion, AccordionSummary, AccordionDetails, useTheme
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedIcon from '@mui/icons-material/Verified';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DescriptionIcon from '@mui/icons-material/Description';
import PaymentsIcon from '@mui/icons-material/Payments';
import WatchLaterIcon from '@mui/icons-material/WatchLater';
import { LanguageContext } from '../App';
import { API_BASE_URL } from '../apiConfig';

async function translate(text, lang) {
  if (!text || lang === 'en') return text;
  try {
    const res = await axios.post(`${API_BASE_URL}/translate`, { text, target_language: lang });
    return res.data.translated || text;
  } catch { return text; }
}

function DeadlineBadge({ days }) {
  const isDark = useTheme().palette.mode === 'dark';
  if (days > 14) return (
    <Chip label={`${days}d left`} size="small" sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }} />
  );
  if (days > 5) return (
    <Chip label={`${days}d left`} size="small" sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(245,158,11,0.15)' : '#fef3c7', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }} />
  );
  return (
    <Chip label={`${days}d left`} size="small" icon={<WatchLaterIcon sx={{ fontSize: '13px !important', color: '#ef4444 !important' }} />} sx={{ fontWeight: 800, bgcolor: isDark ? 'rgba(239,68,68,0.15)' : '#fef2f2', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }} />
  );
}

function EligibleCard({ scheme, index }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const colors = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
  const color = colors[index % colors.length];
  const [expanded, setExpanded] = useState(false);

  return (
    <Fade in timeout={300 + index * 80}>
      <Paper
        sx={{
          borderRadius: 3.5,
          border: `1px solid ${color}30`,
          bgcolor: isDark ? 'rgba(17, 24, 39, 0.8)' : '#ffffff',
          overflow: 'hidden',
          boxShadow: isDark ? `0 8px 24px rgba(0,0,0,0.3), inset 0 0 0 1px ${color}20` : `0 4px 16px rgba(0,0,0,0.06)`,
          transition: 'transform 0.2s',
          '&:hover': { transform: 'translateY(-2px)' },
        }}
      >
        <Box sx={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
        <Box sx={{ p: 2.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 1.5 }}>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
              <Avatar sx={{ width: 36, height: 36, background: `linear-gradient(135deg, ${color}, ${color}cc)`, flexShrink: 0 }}>
                <VerifiedIcon sx={{ fontSize: 18 }} />
              </Avatar>
              <Box>
                <Typography fontWeight={800} fontSize={14} lineHeight={1.3}>{scheme.name}</Typography>
                <Typography variant="caption" color="text.secondary">{scheme.provider}</Typography>
              </Box>
            </Box>
            <DeadlineBadge days={scheme.days_left} />
          </Box>

          {/* Amount + Deadline */}
          <Stack direction="row" spacing={2} mb={1.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <PaymentsIcon sx={{ fontSize: 14, color }} />
              <Typography variant="caption" fontWeight={700} color={color}>{scheme.amount}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
              <CalendarTodayIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Deadline: {new Date(scheme.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </Typography>
            </Box>
          </Stack>

          {/* Docs (collapsible) */}
          <Button
            size="small"
            onClick={() => setExpanded(!expanded)}
            endIcon={<ExpandMoreIcon sx={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />}
            sx={{
              px: 1.2,
              py: 0.5,
              borderRadius: 2,
              fontWeight: 700,
              fontSize: 12,
              color: color,
              bgcolor: `${color}10`,
              mb: expanded ? 1.5 : 0,
              '&:hover': { bgcolor: `${color}18` },
            }}
          >
            {expanded ? 'Hide' : 'Show'} required documents ({scheme.required_documents.length})
          </Button>

          <Collapse in={expanded}>
            <Box sx={{ pl: 0.5 }}>
              {scheme.required_documents.map((doc, i) => (
                <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                  <CheckCircleIcon sx={{ fontSize: 14, color }} />
                  <Typography variant="caption" fontWeight={600}>{doc}</Typography>
                </Box>
              ))}
            </Box>
          </Collapse>

          <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
            <Button
              href={scheme.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              variant="contained"
              endIcon={<OpenInNewIcon sx={{ fontSize: '13px !important' }} />}
              sx={{
                borderRadius: 2.5,
                fontWeight: 700,
                fontSize: 12,
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                boxShadow: 'none',
                '&:hover': { boxShadow: `0 4px 12px ${color}50` },
              }}
            >
              Apply Now
            </Button>
          </Box>
        </Box>
      </Paper>
    </Fade>
  );
}

export default function EligibilityChecker({ onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useContext(LanguageContext);

  const [step, setStep] = useState('input');   // input | results
  const [loading, setLoading] = useState(false);

  // Form state
  const [query, setQuery] = useState('');
  const [cgpa, setCgpa] = useState('');
  const [semester, setSemester] = useState('');
  const [category, setCategory] = useState('');
  const [income, setIncome] = useState('');

  // Results
  const [summary, setSummary] = useState('');
  const [eligible, setEligible] = useState([]);
  const [ineligible, setIneligible] = useState([]);

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2.5,
      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    }
  };

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/check-eligibility`, {
        query: query || 'Can I apply for any scholarship?',
        student_cgpa: cgpa ? parseFloat(cgpa) : null,
        student_semester: semester ? parseInt(semester) : null,
        student_category: category || null,
        student_income_lpa: income ? parseFloat(income) : null,
      });

      const translatedSummary = await translate(res.data.summary, language);
      setSummary(translatedSummary || res.data.summary);
      setEligible(res.data.eligible || []);
      setIneligible(res.data.ineligible || []);
      setStep('results');
    } catch {
      setSummary('Could not check eligibility. Please try again.');
      setStep('results');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      sx={{
        borderRadius: 4,
        border: isDark ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #a7f3d0',
        bgcolor: isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff',
        overflow: 'hidden',
        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 12px 40px rgba(16,185,129,0.1)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(6,182,212,0.08) 100%)',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #d1fae5',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Avatar sx={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', width: 42, height: 42 }}>
          <SchoolIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>Scholarship Eligibility Checker</Typography>
          <Typography variant="caption" color="text.secondary">
            Enter your profile — AI checks all DTU & national schemes instantly
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
                label="What do you want to know? (optional)"
                placeholder="e.g. Can I apply for the scholarship? Am I eligible for any financial aid?"
                value={query}
                onChange={e => setQuery(e.target.value)}
                sx={{ mb: 2.5, ...fieldSx }}
              />

              <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase" letterSpacing={0.8} display="block" mb={1.5}>
                Your Profile (helps narrow results)
              </Typography>

              <Grid container spacing={2} mb={2.5}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CGPA"
                    placeholder="e.g. 7.8"
                    type="number"
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    value={cgpa}
                    onChange={e => setCgpa(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>Semester</InputLabel>
                    <Select
                      value={semester}
                      label="Semester"
                      onChange={e => setSemester(e.target.value)}
                      sx={{ borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}
                    >
                      {[1,2,3,4,5,6,7,8].map(s => (
                        <MenuItem key={s} value={s}>Semester {s}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={fieldSx}>
                    <InputLabel>Category</InputLabel>
                    <Select
                      value={category}
                      label="Category"
                      onChange={e => setCategory(e.target.value)}
                      sx={{ borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}
                    >
                      {['General', 'OBC', 'SC', 'ST', 'EBC', 'DNT'].map(c => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Family Income (LPA)"
                    placeholder="e.g. 3.5"
                    type="number"
                    inputProps={{ min: 0, step: 0.1 }}
                    value={income}
                    onChange={e => setIncome(e.target.value)}
                    sx={fieldSx}
                  />
                </Grid>
              </Grid>

              <Alert
                severity="info"
                sx={{
                  mb: 2.5,
                  borderRadius: 2.5,
                  bgcolor: isDark ? 'rgba(6,182,212,0.08)' : '#f0fdfa',
                  border: isDark ? '1px solid rgba(6,182,212,0.2)' : '1px solid #99f6e4',
                  '& .MuiAlert-icon': { color: isDark ? '#67e8f9' : '#0d9488' },
                  color: isDark ? '#a5f3fc' : '#0f766e',
                  fontSize: 12,
                }}
              >
                Profile fields are optional — leave blank to see all schemes. Filling them filters to only eligible schemes.
              </Alert>

              <Button
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                onClick={handleCheck}
                disabled={loading}
                sx={{
                  borderRadius: 3,
                  fontWeight: 700,
                  py: 1.2,
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  boxShadow: '0 4px 16px rgba(16,185,129,0.35)',
                  '&:hover': { boxShadow: '0 6px 20px rgba(16,185,129,0.5)' },
                }}
              >
                {loading ? 'Checking Eligibility...' : 'Check Eligibility'}
              </Button>
            </Box>
          </Fade>
        )}

        {/* STEP 2: Results */}
        {step === 'results' && (
          <Fade in>
            <Box>
              {/* AI Summary */}
              <Box
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 3,
                  bgcolor: isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4',
                  border: isDark ? '1px solid rgba(16,185,129,0.2)' : '1px solid #a7f3d0',
                  display: 'flex',
                  gap: 1.5,
                  alignItems: 'flex-start',
                }}
              >
                <AutoAwesomeIcon sx={{ color: '#10b981', mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" fontWeight={600} lineHeight={1.7}>{summary}</Typography>
              </Box>

              {/* Eligible Schemes */}
              {eligible.length > 0 && (
                <Box mb={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#10b981' }} />
                    <Typography variant="subtitle1" fontWeight={800} color="success.main">
                      Eligible ({eligible.length})
                    </Typography>
                  </Box>
                  <Stack spacing={2}>
                    {eligible.map((s, i) => <EligibleCard key={s.id} scheme={s} index={i} />)}
                  </Stack>
                </Box>
              )}

              {eligible.length === 0 && (
                <Alert
                  severity="warning"
                  sx={{
                    mb: 3,
                    borderRadius: 3,
                    fontWeight: 600,
                    bgcolor: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb',
                    border: isDark ? '1px solid rgba(245,158,11,0.25)' : '1px solid #fde68a',
                  }}
                >
                  No schemes currently match your profile. Try updating your CGPA or check again next semester.
                </Alert>
              )}

              {/* Ineligible (collapsed) */}
              {ineligible.length > 0 && (
                <Accordion
                  sx={{
                    borderRadius: '12px !important',
                    border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
                    bgcolor: isDark ? 'rgba(17,24,39,0.5)' : '#f8fafc',
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    mb: 2,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CancelIcon sx={{ color: 'text.disabled', fontSize: 18 }} />
                      <Typography variant="body2" fontWeight={700} color="text.secondary">
                        Not eligible ({ineligible.length}) — see reasons
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Stack spacing={1.5}>
                      {ineligible.map((s, i) => (
                        <Paper
                          key={s.id}
                          sx={{
                            p: 2,
                            borderRadius: 3,
                            bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f1f5f9',
                            border: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #e2e8f0',
                          }}
                        >
                          <Typography variant="body2" fontWeight={700} mb={0.5}>{s.name}</Typography>
                          {(s.fail_reasons || []).map((r, j) => (
                            <Box key={j} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <CancelIcon sx={{ fontSize: 12, color: 'error.main' }} />
                              <Typography variant="caption" color="text.secondary">{r}</Typography>
                            </Box>
                          ))}
                        </Paper>
                      ))}
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )}

              <Button
                variant="outlined"
                size="small"
                onClick={() => setStep('input')}
                sx={{ borderRadius: 2.5, fontWeight: 700, color: 'text.secondary', borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#e2e8f0' }}
              >
                ← Check with different profile
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
}
