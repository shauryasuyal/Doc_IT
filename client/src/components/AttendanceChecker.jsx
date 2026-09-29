import React, { useState } from 'react';
import {
  Box, Typography, Paper, Chip, Stack, Avatar, Fade,
  LinearProgress, Alert, Divider, Button, TextField, Tooltip, useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ClassIcon from '@mui/icons-material/Class';
import IconButton from '@mui/material/IconButton';

const MIN_ATTENDANCE = 75;

function getRisk(pct) {
  if (pct >= 85) return { label: 'Safe', color: '#10b981', icon: '✅', tip: 'You can miss a few more classes.' };
  if (pct >= 75) return { label: 'Borderline', color: '#f59e0b', icon: '⚠️', tip: 'Don\'t miss any more classes.' };
  if (pct >= 65) return { label: 'At Risk', color: '#f97316', icon: '🔴', tip: 'You need medical/duty leave approval.' };
  return { label: 'Detained', color: '#ef4444', icon: '❌', tip: 'Below 65% — contact HOD immediately.' };
}

const emptySubject = () => ({ name: '', attended: '', total: '' });

export default function AttendanceChecker({ onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [subjects, setSubjects] = useState([
    { name: 'Mathematics', attended: '28', total: '35' },
    { name: 'Physics', attended: '22', total: '30' },
    { name: 'Programming', attended: '38', total: '40' },
  ]);

  const addSubject = () => setSubjects(s => [...s, emptySubject()]);
  const removeSubject = (i) => setSubjects(s => s.filter((_, idx) => idx !== i));
  const update = (i, field, val) => setSubjects(s => s.map((sub, idx) => idx === i ? { ...sub, [field]: val } : sub));

  const computed = subjects.map(sub => {
    const att = parseInt(sub.attended) || 0;
    const tot = parseInt(sub.total) || 0;
    const pct = tot > 0 ? (att / tot) * 100 : null;
    // How many classes can still be missed before going below 75%
    const canMiss = tot > 0 ? Math.floor((att - 0.75 * tot) / 0.75) : null;
    // How many classes need to attend to reach 75%
    const needAttend = pct !== null && pct < 75 ? Math.ceil((0.75 * tot - att) / 0.25) : null;
    return { ...sub, pct, canMiss: canMiss > 0 ? canMiss : 0, needAttend, risk: pct !== null ? getRisk(pct) : null };
  });

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
      bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
      fontSize: 13,
    }
  };

  const atRiskCount = computed.filter(s => s.pct !== null && s.pct < 75).length;
  const overallPct = (() => {
    const tot = computed.reduce((s, c) => s + (parseInt(c.total) || 0), 0);
    const att = computed.reduce((s, c) => s + (parseInt(c.attended) || 0), 0);
    return tot > 0 ? ((att / tot) * 100).toFixed(1) : null;
  })();

  return (
    <Paper sx={{
      borderRadius: 4,
      border: isDark ? '1px solid rgba(245,158,11,0.25)' : '1px solid #fde68a',
      bgcolor: isDark ? 'rgba(17,24,39,0.92)' : '#ffffff',
      overflow: 'hidden',
      boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 12px 40px rgba(245,158,11,0.12)',
      maxHeight: '88vh', overflowY: 'auto',
    }}>
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2,
        background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(249,115,22,0.08))',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #fde68a',
      }}>
        <Avatar sx={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', width: 42, height: 42 }}>
          <ClassIcon />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>Attendance Risk Checker</Typography>
          <Typography variant="caption" color="text.secondary">DTU requires ≥75% per subject. Check your standing.</Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Summary banner */}
        {overallPct !== null && (
          <Box sx={{
            mb: 3, p: 2, borderRadius: 3, display: 'flex', gap: 3, alignItems: 'center', flexWrap: 'wrap',
            bgcolor: isDark ? 'rgba(245,158,11,0.08)' : '#fffbeb',
            border: isDark ? '1px solid rgba(245,158,11,0.2)' : '1px solid #fde68a',
          }}>
            <Box>
              <Typography variant="caption" fontWeight={700} color="text.secondary" display="block">Overall Attendance</Typography>
              <Typography variant="h4" fontWeight={900} sx={{ color: getRisk(parseFloat(overallPct)).color, lineHeight: 1.2 }}>
                {overallPct}%
              </Typography>
            </Box>
            {atRiskCount > 0 ? (
              <Alert severity="warning" sx={{ flex: 1, borderRadius: 2.5, py: 0.5, fontWeight: 700 }}>
                {atRiskCount} subject{atRiskCount > 1 ? 's' : ''} below 75% — action required!
              </Alert>
            ) : (
              <Alert severity="success" sx={{ flex: 1, borderRadius: 2.5, py: 0.5, fontWeight: 700 }}>
                All subjects safe ✅
              </Alert>
            )}
          </Box>
        )}

        {/* Subjects */}
        <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase" letterSpacing={0.8} display="block" mb={1.5}>
          Subjects
        </Typography>

        <Stack spacing={2} mb={2}>
          {computed.map((sub, i) => (
            <Fade in key={i}>
              <Paper sx={{
                p: 2, borderRadius: 3,
                border: sub.risk ? `1px solid ${sub.risk.color}30` : (isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0'),
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
              }}>
                {/* Input row */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5, alignItems: 'center' }}>
                  <TextField size="small" placeholder={`Subject ${i + 1}`} value={sub.name} onChange={e => update(i, 'name', e.target.value)} sx={{ flex: 2, ...fieldSx }} />
                  <TextField size="small" placeholder="Attended" type="number" value={sub.attended} onChange={e => update(i, 'attended', e.target.value)} sx={{ width: 90, ...fieldSx }} />
                  <Typography color="text.disabled" fontWeight={700}>/</Typography>
                  <TextField size="small" placeholder="Total" type="number" value={sub.total} onChange={e => update(i, 'total', e.target.value)} sx={{ width: 90, ...fieldSx }} />
                  <IconButton size="small" onClick={() => removeSubject(i)} sx={{ color: 'text.disabled', '&:hover': { color: '#ef4444' } }}>
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                {/* Progress bar */}
                {sub.pct !== null && (
                  <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" fontWeight={700} sx={{ color: sub.risk.color }}>
                        {sub.risk.icon} {sub.pct.toFixed(1)}% — {sub.risk.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {sub.risk.tip}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(sub.pct, 100)}
                      sx={{
                        height: 6, borderRadius: 3,
                        bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#f1f5f9',
                        '& .MuiLinearProgress-bar': { bgcolor: sub.risk.color, borderRadius: 3 }
                      }}
                    />
                    {sub.pct < 75 && sub.needAttend !== null && (
                      <Typography variant="caption" color="error.main" fontWeight={700} mt={0.5} display="block">
                        Need to attend next {sub.needAttend} consecutive classes to reach 75%
                      </Typography>
                    )}
                    {sub.pct >= 75 && sub.canMiss > 0 && (
                      <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                        Can safely miss up to {sub.canMiss} more class{sub.canMiss !== 1 ? 'es' : ''}
                      </Typography>
                    )}
                  </Box>
                )}
              </Paper>
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
            borderRadius: 2.5, fontWeight: 700,
            borderColor: isDark ? 'rgba(245,158,11,0.3)' : '#fde68a',
            color: '#f59e0b',
            '&:hover': { borderColor: '#f59e0b', bgcolor: isDark ? 'rgba(245,158,11,0.1)' : '#fffbeb' }
          }}
        >
          Add Subject
        </Button>
      </Box>
    </Paper>
  );
}
