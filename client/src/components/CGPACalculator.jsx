import React, { useState } from 'react';
import {
  Box, Typography, TextField, Button, Paper, Chip, Stack, Avatar,
  Fade, IconButton, Divider, useTheme, Table, TableBody, TableCell,
  TableHead, TableRow, Select, MenuItem, FormControl, InputLabel,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CalculateIcon from '@mui/icons-material/Calculate';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const GRADE_POINTS = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0, 'Ab': 0
};

const GRADE_COLORS = {
  'O': '#10b981', 'A+': '#6366f1', 'A': '#8b5cf6', 'B+': '#06b6d4',
  'B': '#f59e0b', 'C': '#f97316', 'P': '#94a3b8', 'F': '#ef4444', 'Ab': '#ef4444'
};

const emptySubject = () => ({ name: '', credits: '4', grade: 'A' });

export default function CGPACalculator({ onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [subjects, setSubjects] = useState([
    { name: 'Mathematics', credits: '4', grade: 'A' },
    { name: 'Physics', credits: '3', grade: 'B+' },
    { name: 'Programming', credits: '4', grade: 'O' },
  ]);
  const [previousCGPA, setPreviousCGPA] = useState('');
  const [previousCredits, setPreviousCredits] = useState('');

  const addSubject = () => setSubjects(s => [...s, emptySubject()]);
  const removeSubject = (i) => setSubjects(s => s.filter((_, idx) => idx !== i));
  const updateSubject = (i, field, value) =>
    setSubjects(s => s.map((sub, idx) => idx === i ? { ...sub, [field]: value } : sub));

  // Calculate SGPA for current semester
  const validSubjects = subjects.filter(s => s.name && s.credits && GRADE_POINTS[s.grade] !== undefined);
  const totalCredits = validSubjects.reduce((sum, s) => sum + parseFloat(s.credits || 0), 0);
  const totalPoints = validSubjects.reduce((sum, s) => sum + (parseFloat(s.credits || 0) * (GRADE_POINTS[s.grade] ?? 0)), 0);
  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : null;

  // Cumulative CGPA
  let cgpa = null;
  if (previousCGPA && previousCredits && sgpa !== null) {
    const prevCr = parseFloat(previousCredits);
    const prevPts = parseFloat(previousCGPA) * prevCr;
    cgpa = ((prevPts + totalPoints) / (prevCr + totalCredits)).toFixed(2);
  }

  const getSGPAColor = (val) => {
    const v = parseFloat(val);
    if (v >= 9) return '#10b981';
    if (v >= 7.5) return '#6366f1';
    if (v >= 6) return '#f59e0b';
    return '#ef4444';
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
    }
  };

  return (
    <Paper sx={{
      borderRadius: 4,
      border: isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid #e9d5ff',
      bgcolor: isDark ? 'rgba(17,24,39,0.92)' : '#ffffff',
      overflow: 'hidden',
      boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 12px 40px rgba(139,92,246,0.12)',
      maxHeight: '88vh', overflowY: 'auto',
    }}>
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2,
        background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(99,102,241,0.08))',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e9d5ff',
      }}>
        <Avatar sx={{ background: 'linear-gradient(135deg, #8b5cf6, #6366f1)', width: 42, height: 42 }}>
          <CalculateIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>CGPA / SGPA Calculator</Typography>
          <Typography variant="caption" color="text.secondary">Add subjects, credits & grades — result updates live</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Result Banner */}
        {sgpa !== null && (
          <Fade in>
            <Box sx={{
              mb: 3, p: 2.5, borderRadius: 3,
              background: isDark
                ? `linear-gradient(135deg, rgba(139,92,246,0.15), rgba(99,102,241,0.1))`
                : 'linear-gradient(135deg, #f5f3ff, #ede9fe)',
              border: isDark ? '1px solid rgba(139,92,246,0.25)' : '1px solid #c4b5fd',
              display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap',
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">Semester SGPA</Typography>
                <Typography variant="h4" fontWeight={900} sx={{ color: getSGPAColor(sgpa), lineHeight: 1.1 }}>{sgpa}</Typography>
                <Typography variant="caption" color="text.secondary">{totalCredits} credits</Typography>
              </Box>
              {cgpa !== null && (
                <>
                  <Box sx={{ fontSize: 24, color: 'text.disabled', fontWeight: 300 }}>→</Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">Cumulative CGPA</Typography>
                    <Typography variant="h4" fontWeight={900} sx={{ color: getSGPAColor(cgpa), lineHeight: 1.1 }}>{cgpa}</Typography>
                    <Typography variant="caption" color="text.secondary">{parseFloat(previousCredits) + totalCredits} total credits</Typography>
                  </Box>
                </>
              )}
              <Box sx={{ ml: 'auto' }}>
                <Chip
                  label={parseFloat(sgpa) >= 9 ? '🏆 Outstanding' : parseFloat(sgpa) >= 7.5 ? '⭐ First Division' : parseFloat(sgpa) >= 6 ? '✅ Passing' : '⚠️ At Risk'}
                  sx={{
                    fontWeight: 800,
                    bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'white',
                    border: `1px solid ${getSGPAColor(sgpa)}40`,
                    color: getSGPAColor(sgpa),
                  }}
                />
              </Box>
            </Box>
          </Fade>
        )}

        {/* Previous CGPA (optional) */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2.5 }}>
          <TextField
            label="Previous CGPA"
            placeholder="e.g. 7.5"
            type="number"
            inputProps={{ min: 0, max: 10, step: 0.01 }}
            value={previousCGPA}
            onChange={e => setPreviousCGPA(e.target.value)}
            size="small"
            sx={{ flex: 1, ...fieldSx }}
          />
          <TextField
            label="Credits completed so far"
            placeholder="e.g. 120"
            type="number"
            value={previousCredits}
            onChange={e => setPreviousCredits(e.target.value)}
            size="small"
            sx={{ flex: 1, ...fieldSx }}
          />
        </Box>

        {/* Subjects Table */}
        <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase" letterSpacing={0.8} display="block" mb={1.5}>
          Current Semester Subjects
        </Typography>

        <Stack spacing={1.5} mb={2}>
          {subjects.map((sub, i) => (
            <Fade in key={i}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <TextField
                  placeholder={`Subject ${i + 1}`}
                  value={sub.name}
                  onChange={e => updateSubject(i, 'name', e.target.value)}
                  size="small"
                  sx={{ flex: 2, ...fieldSx }}
                />
                <FormControl size="small" sx={{ width: 80, ...fieldSx }}>
                  <Select
                    value={sub.credits}
                    onChange={e => updateSubject(i, 'credits', e.target.value)}
                    sx={{ borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}
                  >
                    {[1,2,3,4,5,6].map(c => <MenuItem key={c} value={String(c)}>{c} cr</MenuItem>)}
                  </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 90, ...fieldSx }}>
                  <Select
                    value={sub.grade}
                    onChange={e => updateSubject(i, 'grade', e.target.value)}
                    sx={{ borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', fontWeight: 700, color: GRADE_COLORS[sub.grade] }}
                  >
                    {Object.keys(GRADE_POINTS).map(g => (
                      <MenuItem key={g} value={g} sx={{ fontWeight: 700, color: GRADE_COLORS[g] }}>
                        {g} ({GRADE_POINTS[g]})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 44, height: 36 }}>
                  <Typography variant="body2" fontWeight={800} sx={{ color: GRADE_COLORS[sub.grade] }}>
                    {sub.credits && sub.grade ? (parseFloat(sub.credits) * GRADE_POINTS[sub.grade]).toFixed(0) : '—'}
                  </Typography>
                </Box>
                <IconButton size="small" onClick={() => removeSubject(i)} sx={{ color: 'text.disabled', '&:hover': { color: '#ef4444' } }}>
                  <DeleteIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>
            </Fade>
          ))}
        </Stack>

        <Button
          startIcon={<AddIcon />}
          onClick={addSubject}
          variant="outlined"
          size="small"
          fullWidth
          sx={{
            borderRadius: 2.5, fontWeight: 700, mb: 2.5,
            borderColor: isDark ? 'rgba(139,92,246,0.3)' : '#c4b5fd',
            color: '#8b5cf6',
            '&:hover': { borderColor: '#8b5cf6', bgcolor: isDark ? 'rgba(139,92,246,0.1)' : '#f5f3ff' }
          }}
        >
          Add Subject
        </Button>

        {/* Grade scale reference */}
        <Box sx={{ p: 1.5, borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc', border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #e2e8f0' }}>
          <Typography variant="caption" fontWeight={700} color="text.secondary" display="block" mb={1}>DTU Grade Scale</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
            {Object.entries(GRADE_POINTS).map(([g, p]) => (
              <Chip key={g} label={`${g}=${p}`} size="small" sx={{ fontSize: 11, fontWeight: 700, bgcolor: `${GRADE_COLORS[g]}18`, color: GRADE_COLORS[g], border: `1px solid ${GRADE_COLORS[g]}30` }} />
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
