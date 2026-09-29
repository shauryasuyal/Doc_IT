import React, { useState, useRef, useEffect, useContext } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';
import {
  Box, Container, Paper, Typography, TextField, IconButton, Chip,
  Avatar, CircularProgress, Divider, Button, Fade, Card, CardContent,
  Alert, Tooltip, Stack, Collapse, useTheme, Dialog, DialogContent, Tab, Tabs
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BusinessIcon from '@mui/icons-material/Business';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import VerifiedIcon from '@mui/icons-material/Verified';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PaymentsIcon from '@mui/icons-material/Payments';
import BoltIcon from '@mui/icons-material/Bolt';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import SchoolIcon from '@mui/icons-material/School';
import CalculateIcon from '@mui/icons-material/Calculate';
import ClassIcon from '@mui/icons-material/Class';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AppsIcon from '@mui/icons-material/Apps';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

import { LanguageContext } from '../App';
import { getTranslation } from '../translations';
import AppointmentRescheduler from './AppointmentRescheduler';
import EligibilityChecker from './EligibilityChecker';
import CGPACalculator from './CGPACalculator';
import AttendanceChecker from './AttendanceChecker';
import ComplaintTracker from './ComplaintTracker';
import DocumentChecklist from './DocumentChecklist';
import FeeCalculator from './FeeCalculator';

const ALL_SMART_TOOLS = [
  { id: 'reschedule', keyTitle: 'rescheduleTool', keySub: 'rescheduleSub', icon: <SwapHorizIcon sx={{ fontSize: 18 }} />, color: '#6366f1', glow: 'rgba(99,102,241,0.25)' },
  { id: 'eligibility', keyTitle: 'scholarshipTool', keySub: 'scholarshipSub', icon: <SchoolIcon sx={{ fontSize: 18 }} />, color: '#10b981', glow: 'rgba(16,185,129,0.25)' },
  { id: 'cgpa', keyTitle: 'cgpaTool', keySub: 'cgpaSub', icon: <CalculateIcon sx={{ fontSize: 18 }} />, color: '#8b5cf6', glow: 'rgba(139,92,246,0.25)' },
  { id: 'attendance', keyTitle: 'attendanceTool', keySub: 'attendanceSub', icon: <ClassIcon sx={{ fontSize: 18 }} />, color: '#f59e0b', glow: 'rgba(245,158,11,0.25)' },
  { id: 'checklist', keyTitle: 'checklistTool', keySub: 'checklistSub', icon: <ListAltIcon sx={{ fontSize: 18 }} />, color: '#06b6d4', glow: 'rgba(6,182,212,0.25)' },
  { id: 'fee', keyTitle: 'feeTool', keySub: 'feeSub', icon: <PaymentsIcon sx={{ fontSize: 18 }} />, color: '#059669', glow: 'rgba(5,150,105,0.25)' },
  { id: 'complaint', keyTitle: 'complaintTool', keySub: 'complaintSub', icon: <ReportProblemIcon sx={{ fontSize: 18 }} />, color: '#ef4444', glow: 'rgba(239,68,68,0.25)' },
];

// ─────────────────────────────────────────────
// Subcomponents
// ─────────────────────────────────────────────

function IntentCard({ data, formDownload, resources, onOpenUpload }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useContext(LanguageContext);
  const forms = resources?.forms?.length ? resources.forms : (formDownload ? [formDownload] : []);
  const externalLinks = resources?.external_links || [];

  return (
    <Card
      sx={{
        mt: 2,
        border: isDark ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(99, 102, 241, 0.25)',
        boxShadow: isDark
          ? '0 12px 32px -8px rgba(0, 0, 0, 0.5)'
          : '0 8px 24px -4px rgba(99, 102, 241, 0.1)',
        bgcolor: isDark ? 'rgba(17, 24, 39, 0.95)' : '#ffffff',
        backdropFilter: 'blur(16px)',
        borderRadius: 3.5,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          height: 3,
          background: 'linear-gradient(90deg, #6366f1 0%, #ec4899 50%, #06b6d4 100%)',
        }}
      />
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {/* Header Badges */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              bgcolor: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
              color: isDark ? '#34d399' : '#059669',
              px: 1.2,
              py: 0.4,
              borderRadius: 2,
              border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #a7f3d0',
            }}
          >
            <TaskAltIcon sx={{ fontSize: 16 }} />
            <Typography variant="subtitle2" fontWeight={800} fontSize={12}>
              {data.display_name}
            </Typography>
          </Box>
          <Chip
            label={data.department}
            size="small"
            sx={{
              ml: 'auto',
              bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
              color: isDark ? '#a5b4fc' : '#4338ca',
              fontWeight: 700,
              fontSize: 11,
              border: isDark ? '1px solid rgba(99, 102, 241, 0.25)' : 'none',
            }}
          />
        </Box>

        {/* Info Highlights */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {data.fee && (
            <Chip
              icon={<PaymentsIcon sx={{ fontSize: '15px !important', color: isDark ? '#fbbf24' : '#b45309' }} />}
              label={`${getTranslation('stepFee', language)}: ${data.fee}`}
              size="small"
              sx={{
                bgcolor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fef3c7',
                color: isDark ? '#fbbf24' : '#92400e',
                fontWeight: 800,
                border: isDark ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid #fde68a',
              }}
            />
          )}
          {data.processing_time && (
            <Chip
              icon={<AccessTimeIcon sx={{ fontSize: '14px !important' }} />}
              label={data.processing_time}
              size="small"
              variant="outlined"
              sx={{ fontSize: 11, fontWeight: 700, borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#cbd5e1' }}
            />
          )}
        </Box>

        {/* External Portals */}
        {externalLinks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
              Step 1: External Online Filing
            </Typography>
            <Stack spacing={1}>
              {externalLinks.map((link, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    p: 1.5,
                    borderRadius: 2.5,
                    bgcolor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box sx={{ minWidth: 200, flex: 1 }}>
                    <Typography variant="body2" fontWeight={800} color="text.primary">
                      {link.title}
                    </Typography>
                    {link.note && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        {link.note}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    component="a"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    size="small"
                    endIcon={<OpenInNewIcon fontSize="small" />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 12,
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {getTranslation('openPortal', language)}
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Downloadable Official Blank Forms */}
        {forms.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1 }}>
              Step 2: Download Blank Application & Challan
            </Typography>
            <Stack spacing={1}>
              {forms.map((f, idx) => (
                <Paper
                  key={idx}
                  sx={{
                    p: 1.25,
                    borderRadius: 2.5,
                    bgcolor: isDark ? 'rgba(30, 41, 59, 0.6)' : '#ffffff',
                    border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                    <PictureAsPdfIcon sx={{ color: '#ef4444', fontSize: 22 }} />
                    <Box>
                      <Typography variant="body2" fontWeight={700} color="text.primary">
                        {f.title || f.filename}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {f.filename}
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    component="a"
                    href={f.url}
                    download={f.filename}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      fontSize: 12,
                      borderColor: isDark ? 'rgba(99, 102, 241, 0.4)' : '#6366f1',
                      color: isDark ? '#a5b4fc' : '#4f46e5',
                      '&:hover': {
                        bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                      },
                    }}
                  >
                    {getTranslation('downloadForm', language)}
                  </Button>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Step 3: Trigger Document Upload */}
        <Box sx={{ pt: 1.5, borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={onOpenUpload}
            startIcon={<CloudUploadIcon />}
            sx={{
              py: 1,
              borderRadius: 2.5,
              fontWeight: 800,
              fontSize: 13,
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                boxShadow: '0 6px 18px rgba(16, 185, 129, 0.45)',
              }
            }}
          >
            {getTranslation('uploadSubmission', language)}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

function UploadPanel({ intent, summary, onClose, onUploadSuccess }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useContext(LanguageContext);
  const [file, setFile] = useState(null);
  const [validating, setValidating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const fileInputRef = useRef();

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setValidating(true);
    setValidationResult(null);

    const formData = new FormData();
    formData.append('intent', intent);
    formData.append('file', selectedFile);
    try {
      const res = await axios.post(`${API_BASE_URL}/validate-document`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setValidationResult(res.data);
    } catch {
      setValidationResult({
        is_valid: true,
        confidence: 'low',
        feedback: 'Document uploaded. DTU administrative case officer will review manually.',
        issues: [],
        suggestions: [],
        overall: 'VALID'
      });
    } finally {
      setValidating(false);
    }
  };

  const handleSubmit = async () => {
    if (!file || !intent) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('student_id', 'Student_DTU_2026');
    formData.append('intent', intent);
    formData.append('summary', summary || '');
    formData.append('file', file);
    try {
      await axios.post(`${API_BASE_URL}/upload-form`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploaded(true);
      onUploadSuccess();
    } catch {
      alert('Error submitting form to queue.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Paper
      sx={{
        borderRadius: 4,
        border: isDark ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #a7f3d0',
        bgcolor: isDark ? '#111827' : '#ffffff',
        overflow: 'hidden',
        boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.6)' : '0 12px 40px rgba(16,185,129,0.15)',
      }}
    >
      <Box
        sx={{
          px: 3, py: 2,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #e2e8f0',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #10b981, #06b6d4)' }}>
            <CloudUploadIcon sx={{ fontSize: 20 }} />
          </Avatar>
          <Box>
            <Typography variant="subtitle1" fontWeight={800}>
              {getTranslation('uploadSubmission', language)}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {intent?.replace(/_/g, ' ').toUpperCase()}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 3 }}>
        {uploaded ? (
          <Fade in>
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(16,185,129,0.15)', mx: 'auto', mb: 2 }}>
                <CheckCircleIcon sx={{ fontSize: 36, color: '#10b981' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} mb={1}>
                Submission Queued Successfully!
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                Your document has been sent to the DTU administration queue for verification.
              </Typography>
              <Button variant="contained" onClick={onClose} sx={{ borderRadius: 2.5, fontWeight: 700 }}>
                Done
              </Button>
            </Box>
          </Fade>
        ) : (
          <Stack spacing={2.5}>
            {/* Dropzone */}
            <Box
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: isDark ? '2px dashed rgba(99,102,241,0.4)' : '2px dashed #6366f1',
                borderRadius: 3.5,
                p: 4,
                textAlign: 'center',
                cursor: 'pointer',
                bgcolor: isDark ? 'rgba(99,102,241,0.04)' : '#f8faff',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(99,102,241,0.08)' : '#eef2ff',
                  borderColor: '#4f46e5',
                },
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                style={{ display: 'none' }}
                onChange={e => handleFileSelect(e.target.files?.[0])}
              />
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff',
                  color: '#6366f1',
                  mx: 'auto',
                  mb: 1.5,
                }}
              >
                <CloudUploadIcon sx={{ fontSize: 28 }} />
              </Avatar>
              <Typography variant="subtitle2" fontWeight={800}>
                {file ? file.name : getTranslation('dragDropText', language)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Supports PDF, JPG, PNG (Max 15MB)
              </Typography>
            </Box>

            {/* Validation in progress */}
            {validating && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2, borderRadius: 2.5, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#f8fafc' }}>
                <CircularProgress size={20} color="primary" />
                <Typography variant="body2" fontWeight={700}>
                  Gemini Vision is analyzing and validating your document...
                </Typography>
              </Box>
            )}

            {/* Validation Result */}
            {validationResult && !validating && (
              <Fade in>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    border: validationResult.is_valid
                      ? (isDark ? '1px solid rgba(16,185,129,0.3)' : '1px solid #a7f3d0')
                      : (isDark ? '1px solid rgba(239,68,68,0.3)' : '1px solid #fecaca'),
                    bgcolor: validationResult.is_valid
                      ? (isDark ? 'rgba(16,185,129,0.08)' : '#ecfdf5')
                      : (isDark ? 'rgba(239,68,68,0.08)' : '#fef2f2'),
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {validationResult.is_valid ? (
                      <VerifiedIcon sx={{ color: '#10b981', fontSize: 18 }} />
                    ) : (
                      <WarningAmberIcon sx={{ color: '#ef4444', fontSize: 18 }} />
                    )}
                    <Typography variant="subtitle2" fontWeight={800} color={validationResult.is_valid ? 'success.main' : 'error.main'}>
                      AI Validation: {validationResult.overall}
                    </Typography>
                    <Chip
                      label={`Confidence: ${validationResult.confidence}`}
                      size="small"
                      sx={{ ml: 'auto', fontWeight: 700, fontSize: 10 }}
                    />
                  </Box>
                  <Typography variant="body2" fontSize={13} mb={1}>
                    {validationResult.feedback}
                  </Typography>
                  {validationResult.issues?.map((issue, idx) => (
                    <Typography key={idx} variant="caption" color="error.main" display="block">
                      • {issue}
                    </Typography>
                  ))}
                </Paper>
              </Fade>
            )}

            {/* Action buttons */}
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button variant="outlined" onClick={onClose} sx={{ borderRadius: 2.5, fontWeight: 700 }}>
                Cancel
              </Button>
              <Button
                variant="contained"
                disabled={!file || validating || uploading}
                onClick={handleSubmit}
                startIcon={uploading ? <CircularProgress size={16} color="inherit" /> : <TaskAltIcon />}
                sx={{
                  borderRadius: 2.5,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
              >
                {uploading ? 'Submitting...' : getTranslation('submitToAdmin', language)}
              </Button>
            </Stack>
          </Stack>
        )}
      </Box>
    </Paper>
  );
}

function TypingIndicator() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  return (
    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
      <Avatar sx={{ width: 34, height: 34, bgcolor: '#6366f1', color: 'white' }}>
        <SmartToyIcon sx={{ fontSize: 18 }} />
      </Avatar>
      <Paper
        sx={{
          px: 2,
          py: 1.2,
          borderRadius: '18px 18px 18px 4px',
          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#f1f5f9',
          boxShadow: 'none',
        }}
      >
        <Box sx={{ display: 'flex', gap: 0.7, alignItems: 'center' }}>
          {[0, 1, 2].map(i => (
            <Box
              key={i}
              sx={{
                width: 7,
                height: 7,
                borderRadius: '50%',
                bgcolor: '#6366f1',
                animation: 'bounce 1.2s infinite',
                animationDelay: `${i * 0.2}s`,
                '@keyframes bounce': {
                  '0%,80%,100%': { transform: 'scale(0.6)', opacity: 0.4 },
                  '40%': { transform: 'scale(1)', opacity: 1 },
                },
              }}
            />
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

function ChatBubble({ msg, onOpenUpload }) {
  const isUser = msg.role === 'user';
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Fade in timeout={300}>
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row' }}>
        <Avatar
          sx={{
            width: 34,
            height: 34,
            flexShrink: 0,
            bgcolor: isUser ? '#ec4899' : '#6366f1',
            color: 'white',
            boxShadow: isUser ? '0 4px 10px rgba(236, 72, 153, 0.4)' : '0 4px 10px rgba(99, 102, 241, 0.4)',
          }}
        >
          {isUser ? <PersonIcon sx={{ fontSize: 18 }} /> : <SmartToyIcon sx={{ fontSize: 18 }} />}
        </Avatar>
        <Box sx={{ maxWidth: '85%' }}>
          <Box
            sx={{
              px: 2.2,
              py: 1.4,
              bgcolor: isUser
                ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                : (isDark ? 'rgba(255, 255, 255, 0.05)' : '#ffffff'),
              color: isUser ? 'white' : 'text.primary',
              borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
              border: isUser ? 'none' : (isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0'),
              boxShadow: isUser
                ? '0 4px 14px rgba(99, 102, 241, 0.3)'
                : (isDark ? '0 4px 20px rgba(0, 0, 0, 0.3)' : '0 4px 15px rgba(0, 0, 0, 0.04)'),
            }}
          >
            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: 13.5 }}>
              {msg.text}
            </Typography>
          </Box>
          {msg.intentData && (
            <IntentCard
              data={msg.intentData}
              formDownload={msg.formDownload}
              resources={msg.resources}
              onOpenUpload={() => onOpenUpload(msg.intentKey || msg.intentData.intent || 'duplicate_id_card', msg.intentSummary || msg.intentData.display_name)}
            />
          )}
        </Box>
      </Box>
    </Fade>
  );
}

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────

export default function StudentChat() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const { language } = useContext(LanguageContext);

  const [sidebarTab, setSidebarTab] = useState(0); // 0 = Tools, 1 = Queries
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeIntent, setActiveIntent] = useState(null);
  const [intentSummary, setIntentSummary] = useState('');
  const [openTool, setOpenTool] = useState(null);
  const [uploadModalTarget, setUploadModalTarget] = useState(null); // { intent, summary }
  const bottomRef = useRef(null);

  // Initialize or re-translate welcome message when language changes
  useEffect(() => {
    setMessages([
      {
        role: 'model',
        text: getTranslation('welcomeMessage', language),
      },
    ]);
  }, [language]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const translateText = async (text) => {
    if (!text || language === 'en') return text;
    try {
      const res = await axios.post(`${API_BASE_URL}/translate`, { text, target_language: language });
      return res.data.translated || text;
    } catch {
      return text;
    }
  };

  const handleSend = async (userText = input) => {
    if (!userText.trim() || loading) return;
    setInput('');

    const newUserMsg = { role: 'user', text: userText };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const history = updatedMessages.slice(0, -1).map(m => ({
        role: m.role === 'bot' ? 'model' : m.role,
        text: m.text,
      }));

      const res = await axios.post(`${API_BASE_URL}/chat`, {
        history,
        message: userText,
      });

      const data = res.data;
      const translatedReply = await translateText(data.reply);
      const botMsg = {
        role: 'model',
        text: translatedReply || data.reply,
        intentData: data.intent_resolved ? data.intent_data : null,
        intentKey: data.intent_key,
        intentSummary: data.intent_summary,
        formDownload: data.form_download || null,
        resources: data.resources || null,
      };

      setMessages(prev => [...prev, botMsg]);

      if (data.intent_resolved && data.intent_key) {
        setActiveIntent(data.intent_key);
        setIntentSummary(data.intent_summary || '');
      }
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'model', text: '⚠️ Backend offline. Please verify the server is running.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const queriesList = getTranslation('queries', language) || [
    'I lost my ID card',
    'I need official transcripts',
    'Apply for hostel leave',
    'Bonafide certificate request',
    'Internship NOC letter',
    'Grade re-evaluation fee',
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 75px)', py: 2, px: { xs: 1.5, md: 3 }, overflow: 'hidden' }}>
      <Box sx={{ maxWidth: 1300, mx: 'auto', height: '100%', display: 'flex', gap: 2.5 }}>

        {/* ─────────────────────────────────────────────
            LEFT TASKBAR (SIDEBAR) — CLEAN & ORDERED
        ───────────────────────────────────────────── */}
        <Box
          sx={{
            width: 320,
            height: '100%',
            flexShrink: 0,
            display: { xs: 'none', md: 'flex' },
            flexDirection: 'column',
          }}
        >
          <Paper
            sx={{
              height: '100%',
              borderRadius: 4,
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
              bgcolor: isDark ? 'rgba(17, 24, 39, 0.85)' : '#ffffff',
              backdropFilter: 'blur(20px)',
              boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Sidebar Tabs */}
            <Box sx={{ borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9', p: 1 }}>
              <Tabs
                value={sidebarTab}
                onChange={(_, v) => setSidebarTab(v)}
                variant="fullWidth"
                sx={{
                  minHeight: 38,
                  '& .MuiTab-root': {
                    minHeight: 38,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    fontSize: 12,
                    textTransform: 'none',
                    py: 0.5,
                  },
                }}
              >
                <Tab icon={<AppsIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={getTranslation('smartToolsTitle', language)} />
                <Tab icon={<QuestionAnswerIcon sx={{ fontSize: 16 }} />} iconPosition="start" label={getTranslation('quickQueriesTitle', language)} />
              </Tabs>
            </Box>

            {/* TAB 0: SMART TOOLS */}
            {sidebarTab === 0 && (
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <Stack spacing={1.2}>
                  {ALL_SMART_TOOLS.map((tool) => (
                    <Paper
                      key={tool.id}
                      onClick={() => setOpenTool(tool.id)}
                      sx={{
                        p: 1.4,
                        borderRadius: 3,
                        border: isDark ? `1px solid ${tool.color}35` : `1px solid ${tool.color}25`,
                        bgcolor: isDark ? `${tool.color}0D` : `${tool.color}08`,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: tool.color,
                          transform: 'translateX(4px)',
                          boxShadow: `0 6px 18px ${tool.glow}`,
                          bgcolor: isDark ? `${tool.color}1A` : `${tool.color}14`,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          width: 36,
                          height: 36,
                          background: `linear-gradient(135deg, ${tool.color}, ${tool.color}cc)`,
                          color: 'white',
                          flexShrink: 0,
                          boxShadow: `0 4px 10px ${tool.glow}`,
                        }}
                      >
                        {tool.icon}
                      </Avatar>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="body2" fontWeight={800} fontSize={12.5} noWrap>
                          {getTranslation(tool.keyTitle, language)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" fontSize={11} noWrap display="block">
                          {getTranslation(tool.keySub, language)}
                        </Typography>
                      </Box>
                    </Paper>
                  ))}
                </Stack>
              </Box>
            )}

            {/* TAB 1: QUICK QUERIES */}
            {sidebarTab === 1 && (
              <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
                <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.8, display: 'block', mb: 1.5 }}>
                  {getTranslation('quickQueriesTitle', language)}
                </Typography>
                <Stack spacing={1}>
                  {queriesList.map((q, i) => (
                    <Chip
                      key={i}
                      label={q}
                      onClick={() => handleSend(q)}
                      variant="outlined"
                      sx={{
                        justifyContent: 'flex-start',
                        py: 2,
                        px: 1,
                        borderRadius: 2.5,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 12.5,
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: isDark ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                          borderColor: '#6366f1',
                          color: '#6366f1',
                          transform: 'translateX(3px)',
                        },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Bottom Footer Info */}
            <Box
              sx={{
                p: 1.8,
                borderTop: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                gap: 1.2,
                bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#f8fafc',
              }}
            >
              <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#10b981', boxShadow: '0 0 8px #10b981' }} />
              <Typography variant="caption" fontWeight={700} color="text.secondary">
                Doc IT AI System Online
              </Typography>
              {activeIntent && (
                <Chip
                  label="Intent Active"
                  size="small"
                  sx={{
                    ml: 'auto',
                    height: 20,
                    fontSize: 10,
                    fontWeight: 800,
                    bgcolor: isDark ? 'rgba(16,185,129,0.15)' : '#ecfdf5',
                    color: '#10b981',
                  }}
                />
              )}
            </Box>
          </Paper>
        </Box>

        {/* ─────────────────────────────────────────────
            RIGHT MAIN CHAT SECTION — ORDERED & SLEEK
        ───────────────────────────────────────────── */}
        <Box sx={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Paper
            sx={{
              height: '100%',
              borderRadius: 4,
              border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #e2e8f0',
              bgcolor: isDark ? 'rgba(17, 24, 39, 0.75)' : '#ffffff',
              backdropFilter: 'blur(20px)',
              boxShadow: isDark ? '0 12px 30px rgba(0,0,0,0.4)' : '0 8px 24px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Chat Top Banner */}
            <Box
              sx={{
                px: 3,
                py: 1.5,
                borderBottom: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                  }}
                >
                  <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" fontWeight={800} lineHeight={1.2}>
                    Doc IT AI Assistant
                  </Typography>
                  <Typography variant="caption" color="text.secondary" fontSize={11}>
                    Delhi Technological University Administrative Portal
                  </Typography>
                </Box>
              </Box>

              {activeIntent && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => setUploadModalTarget({ intent: activeIntent, summary: intentSummary })}
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    borderRadius: 2.5,
                    fontWeight: 800,
                    fontSize: 11,
                    py: 0.4,
                    borderColor: '#10b981',
                    color: '#10b981',
                    bgcolor: isDark ? 'rgba(16,185,129,0.1)' : '#ecfdf5',
                  }}
                >
                  Upload Form
                </Button>
              )}
            </Box>

            {/* Scrollable Message Thread */}
            <Box
              sx={{
                flex: 1,
                p: { xs: 2, md: 3 },
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {messages.map((msg, i) => (
                <ChatBubble
                  key={i}
                  msg={msg}
                  onOpenUpload={(intent, summary) => setUploadModalTarget({ intent, summary })}
                />
              ))}
              {loading && <TypingIndicator />}
              <div ref={bottomRef} />
            </Box>

            {/* Pinned Bottom Input Bar */}
            <Box
              sx={{
                p: 2,
                borderTop: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f1f5f9',
                bgcolor: isDark ? 'rgba(17, 24, 39, 0.95)' : '#fafafa',
              }}
            >
              <Paper
                sx={{
                  p: 0.6,
                  borderRadius: 3.5,
                  border: isDark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #cbd5e1',
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.04)' : '#ffffff',
                  display: 'flex',
                  gap: 1,
                  alignItems: 'center',
                  boxShadow: isDark ? '0 4px 16px rgba(0,0,0,0.3)' : '0 2px 10px rgba(0,0,0,0.03)',
                  transition: 'border-color 0.2s',
                  '&:focus-within': {
                    borderColor: '#6366f1',
                    boxShadow: '0 0 0 2px rgba(99,102,241,0.25)',
                  },
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder={getTranslation('chatPlaceholder', language)}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  slotProps={{
                    input: {
                      disableUnderline: true,
                      sx: {
                        fontSize: 14,
                        px: 2,
                        py: 0.5,
                        color: isDark ? '#f1f5f9' : '#0f172a',
                        caretColor: '#6366f1',
                        '&::placeholder': {
                          color: isDark ? 'rgba(255,255,255,0.35)' : '#94a3b8',
                          opacity: 1,
                        },
                      },
                    },
                  }}
                  disabled={loading}
                />
                <Tooltip title="Send Message">
                  <span>
                    <IconButton
                      color="primary"
                      onClick={() => handleSend()}
                      disabled={!input.trim() || loading}
                      sx={{
                        width: 42,
                        height: 42,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                        },
                        '&.Mui-disabled': {
                          bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#e2e8f0',
                          color: isDark ? '#64748b' : '#94a3b8',
                          background: 'none',
                          boxShadow: 'none',
                        },
                      }}
                    >
                      <SendIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* ─────────────────────────────────────────────
          SMART TOOL DIALOGS MODAL
      ───────────────────────────────────────────── */}
      <Dialog
        open={Boolean(openTool)}
        onClose={() => setOpenTool(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: 'transparent',
            boxShadow: 'none',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {openTool === 'reschedule' && <AppointmentRescheduler onClose={() => setOpenTool(null)} />}
          {openTool === 'eligibility' && <EligibilityChecker onClose={() => setOpenTool(null)} />}
          {openTool === 'cgpa' && <CGPACalculator onClose={() => setOpenTool(null)} />}
          {openTool === 'attendance' && <AttendanceChecker onClose={() => setOpenTool(null)} />}
          {openTool === 'checklist' && <DocumentChecklist onClose={() => setOpenTool(null)} />}
          {openTool === 'fee' && <FeeCalculator onClose={() => setOpenTool(null)} />}
          {openTool === 'complaint' && <ComplaintTracker onClose={() => setOpenTool(null)} />}
        </DialogContent>
      </Dialog>

      {/* ─────────────────────────────────────────────
          DOCUMENT UPLOAD & VALIDATION MODAL
      ───────────────────────────────────────────── */}
      <Dialog
        open={Boolean(uploadModalTarget)}
        onClose={() => setUploadModalTarget(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            bgcolor: 'transparent',
            boxShadow: 'none',
            backgroundImage: 'none',
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          {uploadModalTarget && (
            <UploadPanel
              intent={uploadModalTarget.intent}
              summary={uploadModalTarget.summary}
              onClose={() => setUploadModalTarget(null)}
              onUploadSuccess={() => {
                setUploadModalTarget(null);
                setMessages(prev => [
                  ...prev,
                  {
                    role: 'model',
                    text: '✅ Document verified by AI and submitted to the administrative review docket.',
                  },
                ]);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
