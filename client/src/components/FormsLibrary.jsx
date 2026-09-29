import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import {
  Box, Container, Typography, Grid, Card, CardContent, CardActions,
  Chip, TextField, InputAdornment, Avatar, Button, Skeleton,
  Paper, Divider, Fade, useTheme, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, CircularProgress, Alert, Tooltip,
  Collapse, LinearProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DescriptionIcon from '@mui/icons-material/Description';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import SchoolIcon from '@mui/icons-material/School';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PhoneIcon from '@mui/icons-material/Phone';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

// ─────────────────────────────────────────────
// Category config aligned with backend ALL_FORMS_METADATA categories
// ─────────────────────────────────────────────

const CATEGORY_CONFIG = {
  'Academic & General':       { color: '#6366f1', icon: '🎓' },
  'Examination Branch':       { color: '#ef4444', icon: '📝' },
  'Academic & Hostel':        { color: '#f59e0b', icon: '🏠' },
  'Clearance & Departure':    { color: '#10b981', icon: '✈️' },
  'Accounts Section':         { color: '#06b6d4', icon: '💰' },
  'Research & Grants':        { color: '#8b5cf6', icon: '🔬' },
  'Ph.D. & Research':         { color: '#ec4899', icon: '📚' },
  'Regulations & Guidelines': { color: '#64748b', icon: '📋' },
  'Identity & Student Records': { color: '#f97316', icon: '🪪' },
};

// Fallback keyword-based category detection for forms without category metadata
function inferCategory(filename) {
  const f = (filename || '').toLowerCase();
  if (f.includes('hostel') || f.includes('room') || f.includes('leave')) return 'Academic & Hostel';
  if (f.includes('exam') || f.includes('re-appear') || f.includes('result') || f.includes('grade')) return 'Examination Branch';
  if (f.includes('fee') || f.includes('refund') || f.includes('payment') || f.includes('account')) return 'Accounts Section';
  if (f.includes('phd') || f.includes('ph.d') || f.includes('thesis') || f.includes('research')) return 'Ph.D. & Research';
  if (f.includes('clearance') || f.includes('noc') || f.includes('departure')) return 'Clearance & Departure';
  if (f.includes('id') || f.includes('identity') || f.includes('duplicate') || f.includes('address')) return 'Identity & Student Records';
  if (f.includes('grant') || f.includes('fellowship') || f.includes('funding')) return 'Research & Grants';
  if (f.includes('regulation') || f.includes('guideline') || f.includes('policy') || f.includes('rule')) return 'Regulations & Guidelines';
  return 'Academic & General';
}

function getCategoryConfig(catLabel) {
  return CATEGORY_CONFIG[catLabel] || { color: '#94a3b8', icon: '📄' };
}

// ─────────────────────────────────────────────
// Form Fill Helper Dialog
// ─────────────────────────────────────────────

function FormFillDialog({ open, onClose, form }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleAsk = useCallback(async () => {
    if (!form) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/form-fill-help`, {
        form_title: form.title || (form.filename || '').replace(/_/g, ' ').replace('.pdf', ''),
        field_question: question || '',
        student_context: 'B.Tech student at DTU',
      });
      setResult(res.data);
    } catch {
      setError('Could not get AI guidance. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, [form, question]);

  // Auto-load on open
  useEffect(() => {
    if (open && form && !result && !loading) {
      handleAsk();
    }
    // eslint-disable-next-line
  }, [open, form]);

  const formTitle = form ? (form.title || (form.filename || '').replace(/_/g, ' ').replace('.pdf', '')) : '';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: 'hidden',
          maxHeight: '88vh',
          bgcolor: isDark ? '#0f172a' : '#ffffff',
        },
      }}
    >
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        px: 3, py: 2.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <NoteAltIcon sx={{ color: '#fff', fontSize: 26 }} />
          <Box>
            <Typography variant="h6" fontWeight={700} color="#fff" fontSize={15} lineHeight={1.2}>
              Form Fill Assistant
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)' }}>
              {formTitle}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: 'rgba(255,255,255,0.8)' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 2.5, overflow: 'auto' }}>
        {/* Question Input */}
        <Box sx={{ mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask something specific e.g. 'What do I write in purpose section?'"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAsk()}
            InputProps={{
              endAdornment: (
                <Button
                  size="small"
                  onClick={handleAsk}
                  disabled={loading}
                  sx={{ minWidth: 70, fontWeight: 700, borderRadius: 2, fontSize: 12 }}
                  variant="contained"
                >
                  {loading ? <CircularProgress size={14} color="inherit" /> : 'Ask AI'}
                </Button>
              ),
              sx: { borderRadius: 2.5, pr: 0.5, fontSize: 13 },
            }}
          />
        </Box>

        {loading && (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <CircularProgress size={36} sx={{ color: '#6366f1' }} />
            <Typography variant="body2" color="text.secondary" mt={1.5}>
              AI is analyzing the form...
            </Typography>
          </Box>
        )}

        {error && <Alert severity="error" sx={{ borderRadius: 2, mb: 2 }}>{error}</Alert>}

        {result && !loading && (
          <Box>
            {/* Steps */}
            {result.steps?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={800} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <NoteAltIcon sx={{ fontSize: 16, color: '#6366f1' }} /> Field-by-Field Guide
                </Typography>
                {result.steps.map((step, i) => (
                  <Box
                    key={i}
                    sx={{
                      mb: 1.5, p: 1.5, borderRadius: 2,
                      border: `1px solid ${isDark ? 'rgba(99,102,241,0.2)' : '#e0e7ff'}`,
                      bgcolor: isDark ? 'rgba(99,102,241,0.06)' : '#f8f7ff',
                    }}
                  >
                    <Typography variant="body2" fontWeight={700} color="#6366f1" mb={0.3}>
                      {i + 1}. {step.field}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" fontSize={13}>
                      {step.instruction}
                    </Typography>
                    {step.tip && (
                      <Chip
                        label={`💡 ${step.tip}`}
                        size="small"
                        sx={{ mt: 0.8, fontSize: 11, bgcolor: isDark ? 'rgba(245,158,11,0.1)' : '#fef3c7', color: '#92400e', border: '1px solid #fde68a' }}
                      />
                    )}
                  </Box>
                ))}
              </Box>
            )}

            {/* Documents needed */}
            {result.documents_needed?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={800} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <CheckCircleIcon sx={{ fontSize: 16, color: '#10b981' }} /> Documents to Keep Ready
                </Typography>
                {result.documents_needed.map((doc, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10b981', flexShrink: 0 }} />
                    <Typography variant="body2" fontSize={13}>{doc}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Common mistakes */}
            {result.common_mistakes?.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={800} mb={1} sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                  <ReportProblemIcon sx={{ fontSize: 16, color: '#f59e0b' }} /> Common Mistakes to Avoid
                </Typography>
                {result.common_mistakes.map((m, i) => (
                  <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.5 }}>
                    <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#f59e0b', flexShrink: 0 }} />
                    <Typography variant="body2" fontSize={13} color="text.secondary">{m}</Typography>
                  </Box>
                ))}
              </Box>
            )}

            {/* Submission info */}
            {result.where_to_submit && (
              <Box sx={{
                p: 1.5, borderRadius: 2,
                border: `1px solid ${isDark ? 'rgba(16,185,129,0.25)' : '#a7f3d0'}`,
                bgcolor: isDark ? 'rgba(16,185,129,0.07)' : '#ecfdf5',
              }}>
                <Typography variant="body2" fontWeight={700} color="success.main" mb={0.3} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 14 }} /> Where to Submit
                </Typography>
                <Typography variant="body2" fontSize={13}>{result.where_to_submit}</Typography>
                {result.processing_time && (
                  <Typography variant="caption" color="text.disabled" mt={0.3} display="block">
                    ⏱ Processing time: {result.processing_time}
                  </Typography>
                )}
              </Box>
            )}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Submission Info Panel (inside FormCard)
// ─────────────────────────────────────────────

const DEPT_INFO = {
  'Academic & General':       { dept: 'Academic Section', location: 'Main Building, Room 101', timings: 'Mon–Fri · 10 AM – 1 PM' },
  'Examination Branch':       { dept: 'Examination Branch', location: 'Exam Block, 1st Floor', timings: 'Mon–Fri · 10 AM – 1 PM' },
  'Academic & Hostel':        { dept: 'Hostel Administration', location: 'Hostel Block, Warden Office', timings: 'Mon–Sat · 9 AM – 5 PM' },
  'Clearance & Departure':    { dept: 'Academic Section', location: 'Main Building, Room 105', timings: 'Mon–Fri · 10 AM – 1 PM' },
  'Accounts Section':         { dept: 'Accounts / Finance Wing', location: 'Main Building, Ground Floor', timings: 'Mon–Fri · 10 AM – 2 PM' },
  'Research & Grants':        { dept: 'Research & PhD Section', location: 'Research Block, Room 201', timings: 'Mon–Fri · 10 AM – 1 PM' },
  'Ph.D. & Research':         { dept: 'Research & PhD Section', location: 'Research Block, Room 201', timings: 'Mon–Fri · 10 AM – 1 PM' },
  'Regulations & Guidelines': { dept: 'Academic Section', location: 'Main Building, Room 101', timings: 'Mon–Fri · 10 AM – 1 PM' },
  'Identity & Student Records': { dept: 'Academic Section', location: 'Main Building, Room 103', timings: 'Mon–Fri · 10 AM – 1 PM' },
};

// ─────────────────────────────────────────────
// FormCard
// ─────────────────────────────────────────────

function FormCard({ form, onFillHelp }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [showInfo, setShowInfo] = useState(false);

  const fileName = form.filename || form.name || '';
  const catLabel = form.category || inferCategory(fileName);
  const { color: catColor } = getCategoryConfig(catLabel);
  const deptInfo = DEPT_INFO[catLabel] || DEPT_INFO['Academic & General'];
  const previewUrl = form.download_url || `${API_BASE_URL}/download-forms/${fileName}`;
  const displayTitle = form.title || fileName.replace(/_/g, ' ').replace('.pdf', '').replace('.PDF', '');

  return (
    <Fade in timeout={300}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 3,
          border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
          bgcolor: isDark ? 'rgba(15, 23, 42, 0.85)' : '#ffffff',
          backdropFilter: 'blur(14px)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          boxShadow: isDark ? '0 2px 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.04)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: isDark
              ? `0 12px 32px rgba(0,0,0,0.5), 0 0 0 1px ${catColor}25`
              : `0 10px 24px rgba(0,0,0,0.08), 0 0 0 1px ${catColor}30`,
          },
        }}
      >
        {/* Top accent bar */}
        <Box sx={{ height: 3, background: `linear-gradient(90deg, ${catColor}, ${catColor}70)` }} />

        <CardContent sx={{ flex: 1, p: '16px 16px 8px' }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
            <Avatar
              sx={{
                width: 38, height: 38, flexShrink: 0,
                bgcolor: `${catColor}18`,
                border: `1.5px solid ${catColor}35`,
              }}
            >
              <DescriptionIcon sx={{ color: catColor, fontSize: 19 }} />
            </Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                variant="body2" fontWeight={700} fontSize={13}
                sx={{ mb: 0.4, lineHeight: 1.4, wordBreak: 'break-word' }}
              >
                {displayTitle}
              </Typography>
              {form.description && (
                <Typography variant="caption" color="text.disabled" sx={{ display: 'block', mb: 0.5, lineHeight: 1.35 }}>
                  {form.description.length > 70 ? form.description.slice(0, 70) + '…' : form.description}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Where to Submit toggle */}
          <Button
            size="small"
            startIcon={<LocationOnIcon sx={{ fontSize: 12 }} />}
            onClick={() => setShowInfo(v => !v)}
            sx={{
              mt: 1, px: 1, py: 0.3, fontSize: 11, fontWeight: 700,
              color: isDark ? 'rgba(255,255,255,0.5)' : '#64748b',
              textTransform: 'none', borderRadius: 1.5,
              bgcolor: showInfo ? (isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9') : 'transparent',
              '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.07)' : '#f1f5f9', color: catColor },
            }}
          >
            {showInfo ? 'Hide submission info' : 'Where to submit?'}
          </Button>

          <Collapse in={showInfo}>
            <Box sx={{
              mt: 1, p: 1.2, borderRadius: 2,
              bgcolor: isDark ? `${catColor}0d` : `${catColor}0a`,
              border: `1px solid ${catColor}25`,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.7, mb: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 13, color: catColor, mt: '2px', flexShrink: 0 }} />
                <Box>
                  <Typography variant="caption" fontWeight={700} color={catColor}>{deptInfo.dept}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{deptInfo.location}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
                <AccessTimeIcon sx={{ fontSize: 12, color: 'text.disabled', flexShrink: 0 }} />
                <Typography variant="caption" color="text.secondary">{deptInfo.timings}</Typography>
              </Box>
              <Typography variant="caption" color="text.disabled" display="block" mt={0.5}>
                💡 Bring originals + 2 self-attested photocopies
              </Typography>
            </Box>
          </Collapse>
        </CardContent>

        <CardActions sx={{ p: '6px 12px 12px', gap: 0.8 }}>
          <Button
            variant="outlined" size="small" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />}
            href={previewUrl} download
            sx={{
              flex: 1, borderRadius: 2, fontWeight: 700, fontSize: 11,
              borderColor: isDark ? `${catColor}45` : `${catColor}70`,
              color: catColor,
              '&:hover': { borderColor: catColor, bgcolor: `${catColor}0f` },
            }}
          >
            Download
          </Button>
          <Button
            variant="contained" size="small" startIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
            href={previewUrl} target="_blank" rel="noopener noreferrer"
            sx={{
              flex: 1, borderRadius: 2, fontWeight: 700, fontSize: 11, boxShadow: 'none',
              background: `linear-gradient(135deg, ${catColor}, ${catColor}cc)`,
              color: 'white',
              '&:hover': { boxShadow: `0 4px 12px ${catColor}55` },
            }}
          >
            Preview
          </Button>
          <Tooltip title="AI Form Fill Help" placement="top">
            <IconButton
              size="small"
              onClick={() => onFillHelp(form)}
              sx={{
                width: 32, height: 32, borderRadius: 2,
                bgcolor: isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff',
                color: '#6366f1',
                '&:hover': { bgcolor: isDark ? 'rgba(99,102,241,0.22)' : '#e0e7ff' },
              }}
            >
              <AutoFixHighIcon sx={{ fontSize: 15 }} />
            </IconButton>
          </Tooltip>
        </CardActions>
      </Card>
    </Fade>
  );
}

// ─────────────────────────────────────────────
// Skeleton
// ─────────────────────────────────────────────

function CardSkeleton() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card sx={{
      borderRadius: 3,
      border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0',
      bgcolor: isDark ? 'rgba(15,23,42,0.7)' : '#fff',
      p: 2, boxShadow: 'none',
    }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5 }}>
        <Skeleton variant="circular" width={38} height={38} />
        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="80%" height={18} />
          <Skeleton variant="text" width="55%" height={14} />
        </Box>
      </Box>
      <Skeleton variant="text" width="40%" height={14} sx={{ mb: 1 }} />
      <Box sx={{ display: 'flex', gap: 0.8, mt: 1.5 }}>
        <Skeleton variant="rounded" height={30} sx={{ flex: 1, borderRadius: 2 }} />
        <Skeleton variant="rounded" height={30} sx={{ flex: 1, borderRadius: 2 }} />
        <Skeleton variant="rounded" width={32} height={30} sx={{ borderRadius: 2 }} />
      </Box>
    </Card>
  );
}

// ─────────────────────────────────────────────
// Category Section Header
// ─────────────────────────────────────────────

function CategorySection({ catLabel, forms, onFillHelp }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { color, icon } = getCategoryConfig(catLabel);

  return (
    <Box sx={{ mb: 5 }}>
      {/* Category header */}
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5,
        pb: 1.5,
        borderBottom: `2px solid ${isDark ? `${color}30` : `${color}40`}`,
      }}>
        <Box sx={{
          width: 36, height: 36, borderRadius: 2,
          bgcolor: `${color}18`, border: `1.5px solid ${color}35`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, flexShrink: 0,
        }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: isDark ? '#f1f5f9' : '#1e293b', lineHeight: 1.2 }}>
            {catLabel}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {forms.length} form{forms.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <Box
          sx={{
            ml: 'auto', px: 1.5, py: 0.3, borderRadius: 10,
            bgcolor: `${color}15`, border: `1px solid ${color}30`,
          }}
        >
          <Typography variant="caption" fontWeight={800} sx={{ color }}>
            {forms.length}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2}>
        {forms.map((form, i) => (
          <Grid item xs={12} sm={6} md={4} key={form.filename || form.name || i}>
            <FormCard form={form} onFillHelp={onFillHelp} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

// ─────────────────────────────────────────────
// Main FormsLibrary
// ─────────────────────────────────────────────

const CATEGORY_ORDER = [
  'Academic & General',
  'Examination Branch',
  'Academic & Hostel',
  'Identity & Student Records',
  'Accounts Section',
  'Clearance & Departure',
  'Ph.D. & Research',
  'Research & Grants',
  'Regulations & Guidelines',
];

export default function FormsLibrary() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [fillHelpForm, setFillHelpForm] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/forms`)
      .then(res => setForms(res.data || []))
      .catch(() => setForms([]))
      .finally(() => setLoading(false));
  }, []);

  // Filter by search
  const filtered = forms.filter(f => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (f.filename || f.name || '').toLowerCase().includes(s) ||
      (f.title || '').toLowerCase().includes(s) ||
      (f.description || '').toLowerCase().includes(s) ||
      (f.category || '').toLowerCase().includes(s)
    );
  });

  // Group by category in proper order
  const grouped = {};
  CATEGORY_ORDER.forEach(cat => { grouped[cat] = []; });
  filtered.forEach(f => {
    const cat = f.category || inferCategory(f.filename || f.name || '');
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(f);
  });

  const nonEmptyCategories = CATEGORY_ORDER.filter(cat => grouped[cat]?.length > 0);

  return (
    <Box sx={{ minHeight: 'calc(100vh - 65px)', py: 5 }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Avatar
              sx={{
                width: 52, height: 52,
                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                color: 'white',
                boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
              }}
            >
              <LibraryBooksIcon sx={{ fontSize: 26 }} />
            </Avatar>
          </Box>
          <Typography
            variant="h4" fontWeight={900} letterSpacing="-0.03em"
            sx={{
              background: isDark
                ? 'linear-gradient(135deg, #c7d2fe 0%, #f9a8d4 60%, #fcd34d 100%)'
                : 'linear-gradient(135deg, #4f46e5 0%, #db2777 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', mb: 0.5,
            }}
          >
            Doc IT — DTU Forms Library
          </Typography>
          <Typography variant="body1" color="text.secondary" fontWeight={500}>
            {forms.length} official forms organized by department — download, preview, or get AI help filling them
          </Typography>
        </Box>

        {/* Search bar */}
        <Paper
          sx={{
            mb: 4, p: 2, borderRadius: 4,
            border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
            bgcolor: isDark ? 'rgba(15, 23, 42, 0.8)' : '#ffffff',
            backdropFilter: 'blur(16px)',
            boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 16px rgba(0,0,0,0.05)',
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by form name, category, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', '&:hover fieldset': { borderColor: '#6366f1 !important' } },
            }}
          />
          {!loading && (
            <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <SchoolIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
              <Typography variant="caption" color="text.secondary">
                {search
                  ? <><b style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{filtered.length}</b> result{filtered.length !== 1 ? 's' : ''} for "{search}"</>
                  : <><b style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{forms.length}</b> forms across <b style={{ color: isDark ? '#f1f5f9' : '#1e293b' }}>{nonEmptyCategories.length}</b> departments</>
                }
              </Typography>
              {search && (
                <Chip
                  label="Clear"
                  size="small"
                  onClick={() => setSearch('')}
                  sx={{ fontSize: 11, height: 20, cursor: 'pointer' }}
                />
              )}
            </Box>
          )}
        </Paper>

        {/* Loading */}
        {loading && (
          <>
            <LinearProgress sx={{ mb: 3, borderRadius: 2 }} />
            <Grid container spacing={2}>
              {Array.from({ length: 9 }).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <CardSkeleton />
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/* Category Sections */}
        {!loading && nonEmptyCategories.length === 0 && (
          <Box sx={{ py: 12, textAlign: 'center' }}>
            <DescriptionIcon sx={{ fontSize: 60, color: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', mb: 2 }} />
            <Typography variant="h6" fontWeight={700} color="text.secondary">No forms found</Typography>
            <Typography variant="body2" color="text.disabled">Try a different search term</Typography>
          </Box>
        )}

        {!loading && nonEmptyCategories.map(cat => (
          <CategorySection
            key={cat}
            catLabel={cat}
            forms={grouped[cat]}
            onFillHelp={setFillHelpForm}
          />
        ))}

        {/* Footer */}
        {!loading && forms.length > 0 && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="caption" color="text.disabled">
              All forms are official DTU documents. Contact the relevant department if a form is outdated. · Click ✨ on any form card for AI-powered filling help.
            </Typography>
          </Box>
        )}
      </Container>

      {/* Form Fill Helper Dialog */}
      <FormFillDialog
        open={!!fillHelpForm}
        onClose={() => setFillHelpForm(null)}
        form={fillHelpForm}
      />
    </Box>
  );
}
