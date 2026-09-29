import React, { useState, useContext } from 'react';
import axios from 'axios';
import {
  Box, Typography, Paper, Chip, Stack, Avatar, Fade, Alert,
  Button, TextField, CircularProgress, Divider, useTheme, Checkbox,
  FormControlLabel
} from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import DownloadIcon from '@mui/icons-material/Download';
import { LanguageContext } from '../App';
import { API_BASE_URL } from '../apiConfig';

async function translate(text, lang) {
  if (!text || lang === 'en') return text;
  try {
    const res = await axios.post(`${API_BASE_URL}/translate`, { text, target_language: lang });
    return res.data.translated || text;
  } catch { return text; }
}

const QUICK_NEEDS = [
  'Duplicate ID Card', 'Official Transcripts', 'Degree Certificate',
  'Bonafide Certificate', 'Hostel Leave', 'Internship NOC',
  'Scholarship Application', 'Grade Re-evaluation', 'PhD Admission',
  'Transfer Certificate', 'Migration Certificate', 'Fee Refund'
];

export default function DocumentChecklist({ onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useContext(LanguageContext);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [checklist, setChecklist] = useState(null);  // { title, items: [{doc, note, mandatory}], tips }
  const [checked, setChecked] = useState({});

  const handleGenerate = async (q) => {
    const finalQuery = q || query;
    if (!finalQuery) return;
    setQuery(finalQuery);
    setLoading(true);
    setChecked({});
    try {
      const res = await axios.post(`${API_BASE_URL}/generate-checklist`, { need: finalQuery });
      // Translate if needed
      if (language !== 'en' && res.data.items) {
        for (let item of res.data.items) {
          item.doc = await translate(item.doc, language);
          if (item.note) item.note = await translate(item.note, language);
        }
        if (res.data.tips) res.data.tips = await translate(res.data.tips, language);
      }
      setChecklist(res.data);
    } catch {
      setChecklist({
        title: finalQuery,
        items: [
          { doc: 'Application Form (Common Application Form)', note: 'Download from Forms Library', mandatory: true },
          { doc: 'Student ID Card copy', note: '', mandatory: true },
          { doc: 'Fee Payment Receipt / Bank Challan', note: 'Pay at SBI DTU branch', mandatory: true },
          { doc: 'Aadhaar Card copy', note: 'Self-attested', mandatory: true },
          { doc: 'Passport-size photographs (2 copies)', note: '', mandatory: false },
        ],
        tips: 'Submit all documents to the Academic Section window between 9 AM – 1 PM on working days.'
      });
    } finally {
      setLoading(false);
    }
  };

  const allMandatoryChecked = checklist?.items?.filter(i => i.mandatory).every((_, idx) => checked[`m-${idx}`]);
  const totalDone = Object.values(checked).filter(Boolean).length;
  const totalItems = checklist?.items?.length || 0;

  return (
    <Paper sx={{
      borderRadius: 4,
      border: isDark ? '1px solid rgba(6,182,212,0.25)' : '1px solid #a5f3fc',
      bgcolor: isDark ? 'rgba(17,24,39,0.92)' : '#ffffff',
      overflow: 'hidden',
      boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 12px 40px rgba(6,182,212,0.1)',
      maxHeight: '88vh', overflowY: 'auto',
    }}>
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2,
        background: 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(99,102,241,0.08))',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #a5f3fc',
      }}>
        <Avatar sx={{ background: 'linear-gradient(135deg, #06b6d4, #6366f1)', width: 42, height: 42 }}>
          <ListAltIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>Document Checklist Generator</Typography>
          <Typography variant="caption" color="text.secondary">Tell AI what you need — get a complete, verified checklist</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Input */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 2 }}>
          <TextField
            fullWidth size="small"
            label="What are you applying for?"
            placeholder="e.g. I need a duplicate ID card, or transcripts for MS application"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleGenerate()}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' } }}
          />
          <Button
            variant="contained" onClick={() => handleGenerate()}
            disabled={!query || loading}
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeIcon />}
            sx={{
              borderRadius: 2.5, fontWeight: 700, whiteSpace: 'nowrap',
              background: 'linear-gradient(135deg, #06b6d4, #6366f1)',
              boxShadow: '0 4px 14px rgba(6,182,212,0.3)',
            }}
          >
            {loading ? 'Generating...' : 'Generate'}
          </Button>
        </Box>

        {/* Quick select chips */}
        {!checklist && !loading && (
          <Box>
            <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>Quick Select:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
              {QUICK_NEEDS.map(n => (
                <Chip key={n} label={n} size="small" onClick={() => handleGenerate(n)}
                  sx={{
                    cursor: 'pointer', fontWeight: 600, fontSize: 12,
                    bgcolor: isDark ? 'rgba(6,182,212,0.1)' : '#ecfeff',
                    color: isDark ? '#67e8f9' : '#0e7490',
                    border: isDark ? '1px solid rgba(6,182,212,0.2)' : '1px solid #a5f3fc',
                    '&:hover': { bgcolor: isDark ? 'rgba(6,182,212,0.2)' : '#cffafe', borderColor: '#06b6d4' }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Checklist result */}
        {checklist && (
          <Fade in>
            <Box>
              {/* Progress */}
              <Box sx={{ mb: 2.5, p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(6,182,212,0.08)' : '#ecfeff', border: isDark ? '1px solid rgba(6,182,212,0.2)' : '1px solid #a5f3fc' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={800}>{checklist.title}</Typography>
                  <Typography variant="caption" fontWeight={800} color={allMandatoryChecked ? 'success.main' : '#06b6d4'}>
                    {totalDone}/{totalItems} ready
                  </Typography>
                </Box>
                <Box sx={{ height: 6, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0', overflow: 'hidden' }}>
                  <Box sx={{ height: '100%', width: `${totalItems > 0 ? (totalDone / totalItems) * 100 : 0}%`, bgcolor: allMandatoryChecked ? '#10b981' : '#06b6d4', borderRadius: 3, transition: 'width 0.3s ease' }} />
                </Box>
                {allMandatoryChecked && (
                  <Alert severity="success" sx={{ mt: 1.5, py: 0.5, borderRadius: 2.5, fontWeight: 700 }}>
                    ✅ All mandatory documents ready — you can submit!
                  </Alert>
                )}
              </Box>

              {/* Mandatory */}
              <Typography variant="caption" fontWeight={800} color="error.main" textTransform="uppercase" letterSpacing={0.8} display="block" mb={1}>
                Mandatory Documents
              </Typography>
              <Stack spacing={0.5} mb={2}>
                {checklist.items.filter(i => i.mandatory).map((item, i) => (
                  <FormControlLabel key={i}
                    control={
                      <Checkbox size="small" checked={!!checked[`m-${i}`]} onChange={e => setChecked(c => ({ ...c, [`m-${i}`]: e.target.checked }))}
                        icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                        checkedIcon={<CheckBoxIcon sx={{ fontSize: 18, color: '#10b981' }} />}
                      />
                    }
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={700} sx={{ textDecoration: checked[`m-${i}`] ? 'line-through' : 'none', color: checked[`m-${i}`] ? 'text.disabled' : 'text.primary', fontSize: 13 }}>
                          {item.doc}
                        </Typography>
                        {item.note && <Typography variant="caption" color="text.secondary">{item.note}</Typography>}
                      </Box>
                    }
                    sx={{ m: 0, p: 1, borderRadius: 2, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' } }}
                  />
                ))}
              </Stack>

              {/* Optional */}
              {checklist.items.filter(i => !i.mandatory).length > 0 && (
                <>
                  <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase" letterSpacing={0.8} display="block" mb={1}>
                    Optional / Supporting
                  </Typography>
                  <Stack spacing={0.5} mb={2}>
                    {checklist.items.filter(i => !i.mandatory).map((item, i) => (
                      <FormControlLabel key={i}
                        control={
                          <Checkbox size="small" checked={!!checked[`o-${i}`]} onChange={e => setChecked(c => ({ ...c, [`o-${i}`]: e.target.checked }))}
                            icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 18, color: 'text.disabled' }} />}
                            checkedIcon={<CheckBoxIcon sx={{ fontSize: 18, color: '#6366f1' }} />}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body2" fontWeight={600} sx={{ textDecoration: checked[`o-${i}`] ? 'line-through' : 'none', color: checked[`o-${i}`] ? 'text.disabled' : 'text.primary', fontSize: 13 }}>
                              {item.doc}
                            </Typography>
                            {item.note && <Typography variant="caption" color="text.secondary">{item.note}</Typography>}
                          </Box>
                        }
                        sx={{ m: 0, p: 1, borderRadius: 2, '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' } }}
                      />
                    ))}
                  </Stack>
                </>
              )}

              {/* AI Tips */}
              {checklist.tips && (
                <Paper sx={{ p: 2, borderRadius: 3, bgcolor: isDark ? 'rgba(99,102,241,0.08)' : '#eef2ff', border: isDark ? '1px solid rgba(99,102,241,0.2)' : '1px solid #c7d2fe' }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <AutoAwesomeIcon sx={{ color: '#6366f1', fontSize: 16, mt: 0.2, flexShrink: 0 }} />
                    <Typography variant="caption" fontWeight={600} lineHeight={1.6}>{checklist.tips}</Typography>
                  </Box>
                </Paper>
              )}

              <Button variant="text" size="small" onClick={() => { setChecklist(null); setQuery(''); }}
                sx={{ mt: 1.5, borderRadius: 2.5, fontWeight: 700, color: 'text.secondary' }}>
                ← Generate another checklist
              </Button>
            </Box>
          </Fade>
        )}
      </Box>
    </Paper>
  );
}
