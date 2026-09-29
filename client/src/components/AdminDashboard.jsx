import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import {
  Box, Container, Paper, Typography, Chip, Avatar, Button, Divider,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Fade, Alert, Stack, Card, CardContent, LinearProgress, CircularProgress,
  Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  useTheme, Tooltip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RefreshIcon from '@mui/icons-material/Refresh';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import NotesIcon from '@mui/icons-material/Notes';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BoltIcon from '@mui/icons-material/Bolt';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

// ─────────────────────────────────────────────
// Stat Card
// ─────────────────────────────────────────────

function StatCard({ label, value, icon, gradient, glowColor }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: 3.5,
        border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
        bgcolor: isDark ? 'rgba(17, 24, 39, 0.7)' : '#ffffff',
        backdropFilter: 'blur(16px)',
        boxShadow: isDark ? `0 10px 30px -10px ${glowColor}` : `0 10px 25px -5px rgba(0,0,0,0.06)`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: gradient,
        }}
      />
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, p: '20px !important' }}>
        <Avatar
          sx={{
            width: 50,
            height: 50,
            background: gradient,
            color: 'white',
            boxShadow: `0 6px 16px ${glowColor}`,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800} lineHeight={1}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" fontWeight={600} mt={0.3}>
            {label}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────
// Reject Dialog
// ─────────────────────────────────────────────

function RejectDialog({ open, onClose, form, onRejected }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiInstructions, setAiInstructions] = useState('');

  const handleReject = async () => {
    if (!reason.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/reject-form/${form.form_id}`, { reason });
      setAiInstructions(res.data.correction_instructions);
      onRejected(res.data);
    } catch {
      alert('Error rejecting form.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setAiInstructions('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          bgcolor: isDark ? '#111827' : '#ffffff',
          border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e2e8f0',
          backgroundImage: 'none',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1, pt: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white' }}>
            <AutoFixHighIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Box>
            <Typography fontWeight={800} fontSize={16}>Reject & Generate AI Correction</Typography>
            <Typography variant="caption" color="text.secondary">
              Gemini will expand your reason into a student-friendly message
            </Typography>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        {form && (
          <Alert
            severity="info"
            sx={{
              mb: 2,
              borderRadius: 2.5,
              bgcolor: isDark ? 'rgba(6, 182, 212, 0.1)' : '#f0fdfa',
              color: isDark ? '#67e8f9' : '#0f766e',
              border: isDark ? '1px solid rgba(6, 182, 212, 0.2)' : '1px solid #ccfbf1',
              '& .MuiAlert-icon': { color: isDark ? '#67e8f9' : '#0f766e' },
            }}
          >
            <Typography variant="body2" fontWeight={700}>{form.student_id}</Typography>
            <Typography variant="caption">{form.intent?.replace(/_/g, ' ')}</Typography>
            {form.summary && <Typography variant="caption" display="block">"{form.summary}"</Typography>}
          </Alert>
        )}

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Short rejection reason"
          placeholder="e.g., Lost report is missing, form not complete, photo not attached..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          disabled={loading || !!aiInstructions}
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2.5,
              bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
            },
          }}
        />

        {aiInstructions && (
          <Paper
            sx={{
              p: 2.5,
              borderRadius: 3,
              bgcolor: isDark ? 'rgba(16, 185, 129, 0.08)' : '#ecfdf5',
              border: isDark ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid #a7f3d0',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <AutoFixHighIcon sx={{ color: '#10b981', fontSize: 18 }} />
              <Typography variant="subtitle2" fontWeight={800} color="success.main">
                Gemini-Generated Student Message
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'text.primary' }}>
              {aiInstructions}
            </Typography>
          </Paper>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ borderRadius: 2.5, fontWeight: 700 }}>
          {aiInstructions ? 'Close' : 'Cancel'}
        </Button>
        {!aiInstructions && (
          <Button
            variant="contained"
            color="error"
            onClick={handleReject}
            disabled={!reason.trim() || loading}
            startIcon={loading ? <CircularProgress size={14} color="inherit" /> : <AutoFixHighIcon />}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              background: loading ? undefined : 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
              boxShadow: '0 4px 14px rgba(239, 68, 68, 0.3)',
            }}
          >
            {loading ? 'Generating...' : 'Reject & Generate Message'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

// ─────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────

export default function AdminDashboard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [forms, setForms] = useState([]);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'success' });
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchForms = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/pending-forms`);
      setForms(res.data);
      setLastRefresh(new Date());
    } catch {
      setSnack({ open: true, msg: 'Could not connect to backend.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchForms();
    const interval = setInterval(fetchForms, 8000);
    return () => clearInterval(interval);
  }, []);

  const [calendarDialog, setCalendarDialog] = useState({ open: false, url: null, slot: null, dept: null });

  const handleApprove = async (formId) => {
    setApprovingId(formId);
    try {
      const res = await axios.post(`${API_BASE_URL}/approve-form/${formId}`);
      setApprovedCount(c => c + 1);
      fetchForms();
      if (res.data.calendar_url) {
        setCalendarDialog({
          open: true,
          url: res.data.calendar_url,
          slot: res.data.slot_time,
          dept: res.data.department,
        });
      } else {
        setSnack({ open: true, msg: `✅ ${res.data.message}`, severity: 'success' });
      }
    } catch {
      setSnack({ open: true, msg: 'Error approving form.', severity: 'error' });
    } finally {
      setApprovingId(null);
    }
  };


  const intentLabel = (key) =>
    (key || '').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <Box sx={{ minHeight: 'calc(100vh - 65px)', py: 4 }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 4 }}>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2.5,
                  background: 'linear-gradient(135deg, #ec4899 0%, #6366f1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(236, 72, 153, 0.4)',
                }}
              >
                <AdminPanelSettingsIcon sx={{ color: 'white', fontSize: 22 }} />
              </Box>
              <Typography variant="h5" fontWeight={800} letterSpacing="-0.02em">
                Doc IT — Admin Dashboard
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 7 }}>
              Approve or reject submissions. Gemini generates student correction messages automatically.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchForms}
            disabled={loading}
            sx={{
              borderRadius: 2.5,
              fontWeight: 700,
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1',
              color: 'text.secondary',
              '&:hover': { borderColor: '#6366f1', color: '#6366f1' },
            }}
          >
            Refresh
          </Button>
        </Box>

        {/* Stats */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
          <StatCard
            label="Pending Review"
            value={forms.length}
            icon={<HourglassEmptyIcon />}
            gradient="linear-gradient(135deg, #f59e0b, #f97316)"
            glowColor="rgba(245, 158, 11, 0.3)"
          />
          <StatCard
            label="Approved Today"
            value={approvedCount}
            icon={<TaskAltIcon />}
            gradient="linear-gradient(135deg, #10b981, #059669)"
            glowColor="rgba(16, 185, 129, 0.3)"
          />
          <StatCard
            label="Rejected"
            value={rejectedCount}
            icon={<CloseIcon />}
            gradient="linear-gradient(135deg, #ef4444, #dc2626)"
            glowColor="rgba(239, 68, 68, 0.3)"
          />
        </Stack>



        {/* Table */}
        <Paper
          sx={{
            borderRadius: 3.5,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
            bgcolor: isDark ? 'rgba(17, 24, 39, 0.7)' : '#ffffff',
            backdropFilter: 'blur(16px)',
            overflow: 'hidden',
            boxShadow: isDark ? '0 20px 50px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.05)',
          }}
        >
          {loading && <LinearProgress color="primary" sx={{ height: 2 }} />}

          {/* Table header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight={800}>
                Pending Submissions
              </Typography>
              {forms.length > 0 && (
                <Chip
                  label={forms.length}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: 12,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                    color: 'white',
                  }}
                />
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.7 }}>
              <FiberManualRecordIcon sx={{ fontSize: 9, color: '#10b981', animation: 'pulse 2s infinite', '@keyframes pulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
              <Typography variant="caption" color="text.secondary">
                Auto-refreshes · {lastRefresh.toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>

          {forms.length === 0 && !loading ? (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <TaskAltIcon sx={{ fontSize: 52, color: isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0', mb: 1.5 }} />
              <Typography variant="h6" fontWeight={700} color="text.secondary">All caught up!</Typography>
              <Typography variant="body2" color="text.disabled">No pending submissions right now</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Student', 'Request Type', 'Context', 'File', 'Status', 'Actions'].map(h => (
                      <TableCell
                        key={h}
                        sx={{
                          fontWeight: 800,
                          fontSize: 11,
                          textTransform: 'uppercase',
                          letterSpacing: 0.8,
                          color: 'text.secondary',
                          py: 1.5,
                          bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc',
                          borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9',
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {forms.map((form, i) => (
                    <Fade in key={form.form_id} timeout={400} style={{ transitionDelay: `${i * 60}ms` }}>
                      <TableRow
                        sx={{
                          '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' },
                          borderBottom: isDark ? '1px solid rgba(255,255,255,0.04)' : '1px solid #f1f5f9',
                          '&:last-child': { borderBottom: 'none' },
                          transition: 'background 0.2s',
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              sx={{
                                width: 30,
                                height: 30,
                                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                                color: 'white',
                                fontSize: 13,
                                fontWeight: 700,
                              }}
                            >
                              {form.student_id?.charAt(0) || 'S'}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600} fontSize={13}>
                              {form.student_id}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={intentLabel(form.intent)}
                            size="small"
                            sx={{
                              bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                              color: isDark ? '#a5b4fc' : '#4338ca',
                              fontWeight: 700,
                              fontSize: 11,
                              border: isDark ? '1px solid rgba(99, 102, 241, 0.25)' : 'none',
                            }}
                          />
                        </TableCell>

                        <TableCell sx={{ maxWidth: 200 }}>
                          {form.summary ? (
                            <Tooltip title={form.summary}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <NotesIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {form.summary}
                                </Typography>
                              </Box>
                            </Tooltip>
                          ) : <Typography variant="caption" color="text.disabled">—</Typography>}
                        </TableCell>

                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <DescriptionIcon sx={{ fontSize: 13, color: '#ef4444' }} />
                            <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 140 }}>
                              {form.filename}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>
                          <Chip
                            icon={<HourglassEmptyIcon sx={{ fontSize: '13px !important', color: '#f59e0b !important' }} />}
                            label="Pending"
                            size="small"
                            sx={{
                              bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
                              color: isDark ? '#fbbf24' : '#92400e',
                              border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #fde68a',
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>

                        <TableCell>
                          <Stack direction="row" spacing={1}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={approvingId === form.form_id ? <CircularProgress size={13} color="inherit" /> : <CheckCircleIcon />}
                              onClick={() => handleApprove(form.form_id)}
                              disabled={approvingId === form.form_id}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: 12,
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)',
                                whiteSpace: 'nowrap',
                                '&:hover': { boxShadow: '0 6px 14px rgba(16, 185, 129, 0.45)' },
                              }}
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<CloseIcon />}
                              onClick={() => setRejectTarget(form)}
                              sx={{
                                borderRadius: 2,
                                fontWeight: 700,
                                fontSize: 12,
                                borderColor: isDark ? 'rgba(239, 68, 68, 0.4)' : '#f87171',
                                color: isDark ? '#f87171' : '#dc2626',
                                whiteSpace: 'nowrap',
                                '&:hover': {
                                  borderColor: '#ef4444',
                                  bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : '#fef2f2',
                                },
                              }}
                            >
                              Reject
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    </Fade>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Workflow Diagram */}
        <Paper
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3.5,
            border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid #e2e8f0',
            bgcolor: isDark ? 'rgba(17, 24, 39, 0.5)' : '#f8fafc',
            boxShadow: 'none',
          }}
        >
          <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ mb: 2 }}>
            Automation Pipeline
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            {[
              { icon: <PersonIcon />, label: 'Student Chats', desc: 'AI extracts intent & fee', color: '#6366f1', glow: 'rgba(99, 102, 241, 0.3)' },
              { icon: <DescriptionIcon />, label: 'Vision Validated', desc: 'Gemini scans submission', color: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.3)' },
              { icon: <AdminPanelSettingsIcon />, label: 'Admin Reviews', desc: 'One-click approve/reject', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.3)' },
              { icon: <CalendarMonthIcon />, label: 'Auto-Scheduled', desc: 'Google Calendar booked', color: '#10b981', glow: 'rgba(16, 185, 129, 0.3)' },
              { icon: <EmailIcon />, label: 'Email Sent', desc: 'Confirmation or AI rejection', color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)' },
            ].map((step, i) => (
              <Box key={i} sx={{ flex: 1, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}99)`,
                    color: 'white',
                    flexShrink: 0,
                    boxShadow: `0 4px 12px ${step.glow}`,
                  }}
                >
                  {step.icon}
                </Avatar>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{step.label}</Typography>
                  <Typography variant="caption" color="text.secondary">{step.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Container>

      {/* Reject Dialog */}
      <RejectDialog
        open={!!rejectTarget}
        form={rejectTarget}
        onClose={() => setRejectTarget(null)}
        onRejected={() => {
          setRejectedCount(c => c + 1);
          setSnack({ open: true, msg: '❌ Form rejected. Gemini correction message generated.', severity: 'warning' });
          setRejectTarget(null);
          fetchForms();
        }}
      />

      {/* ─── Google Calendar Dialog ─── */}
      <Dialog
        open={calendarDialog.open}
        onClose={() => setCalendarDialog(d => ({ ...d, open: false }))}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <Box sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #065f46 100%)',
          py: 3, px: 3, textAlign: 'center',
        }}>
          <CalendarMonthIcon sx={{ fontSize: 48, color: '#fff', mb: 1 }} />
          <Typography variant="h6" fontWeight={700} color="#fff">Form Approved! ✅</Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', mt: 0.5 }}>
            Verification slot suggested
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 3, pb: 2, textAlign: 'center' }}>
          {calendarDialog.slot && (
            <Box sx={{
              bgcolor: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5',
              border: '1px solid',
              borderColor: isDark ? 'rgba(16,185,129,0.3)' : '#6ee7b7',
              borderRadius: 2, px: 2, py: 1.5, mb: 2,
            }}>
              <Typography variant="body2" color="text.secondary" mb={0.3}>Suggested Slot</Typography>
              <Typography variant="h6" fontWeight={700} color="success.main">
                📅 {calendarDialog.slot}
              </Typography>
              {calendarDialog.dept && (
                <Typography variant="caption" color="text.secondary">
                  📍 {calendarDialog.dept}, DTU
                </Typography>
              )}
            </Box>
          )}
          <Typography variant="body2" color="text.secondary">
            Click below to add this verification appointment to Google Calendar so the student can add it too.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, flexDirection: 'column' }}>
          <Button
            fullWidth
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            href={calendarDialog.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              borderRadius: 2, py: 1.2, fontWeight: 700,
              background: 'linear-gradient(135deg, #10b981, #059669)',
              '&:hover': { background: 'linear-gradient(135deg, #059669, #047857)' },
            }}
          >
            📅 Add to Google Calendar
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="inherit"
            onClick={() => setCalendarDialog(d => ({ ...d, open: false }))}
            sx={{ borderRadius: 2, fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snack.severity}
          variant="filled"
          sx={{ borderRadius: 3, fontWeight: 600 }}
          onClose={() => setSnack(s => ({ ...s, open: false }))}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
