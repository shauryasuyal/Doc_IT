import React, { useState } from 'react';
import {
  Box, Typography, Paper, Chip, Stack, Avatar, Fade, Alert,
  Button, Divider, useTheme, Collapse
} from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Full DTU fee schedule
const FEE_ITEMS = [
  { category: 'Certificates & Documents', items: [
    { label: 'Duplicate ID Card', amount: 500, note: 'Pay via SBI Bank Challan at DTU branch', currency: '₹' },
    { label: 'Official Transcript (per set)', amount: 500, note: 'Issued by Examination Branch', currency: '₹' },
    { label: 'Bonafide Certificate', amount: 0, note: 'Free — Academic Section', currency: '₹' },
    { label: 'Provisional Certificate', amount: 200, note: 'Post-result declaration', currency: '₹' },
    { label: 'Degree Certificate', amount: 1000, note: 'Convocation or instant issue', currency: '₹' },
    { label: 'Migration Certificate', amount: 500, note: 'Academic Section', currency: '₹' },
    { label: 'Character Certificate', amount: 0, note: 'Free', currency: '₹' },
    { label: 'Address Proof Letter', amount: 0, note: 'Free — signed by HoD', currency: '₹' },
    { label: 'Verification of Degree (per institution)', amount: 1000, note: 'Examination Branch', currency: '₹' },
  ]},
  { category: 'Examination & Academic', items: [
    { label: 'Grade Re-evaluation (per paper)', amount: 1000, note: 'Apply within 2 weeks of result', currency: '₹' },
    { label: 'Re-appear / Back Paper (per paper)', amount: 2000, note: 'Examination Branch', currency: '₹' },
    { label: 'Grade Card Reprint', amount: 100, note: 'Per semester grade card', currency: '₹' },
    { label: 'Exam form late fee', amount: 1000, note: 'Beyond last date', currency: '₹' },
  ]},
  { category: 'Hostel', items: [
    { label: 'Hostel Admission (first year)', amount: 5000, note: 'Refundable security deposit', currency: '₹' },
    { label: 'Hostel Mess Caution Money', amount: 2000, note: 'Refundable', currency: '₹' },
    { label: 'Hostel Leave Violation Fine', amount: 500, note: 'If leave not formally applied', currency: '₹' },
  ]},
  { category: 'Miscellaneous', items: [
    { label: 'Library Fine (per book per day)', amount: 5, note: 'Charged on overdue returns', currency: '₹' },
    { label: 'Anti-Ragging Fine', amount: 5000, note: 'Minimum penalty', currency: '₹' },
    { label: 'Duplicate Fee Receipt', amount: 100, note: 'Accounts Section', currency: '₹' },
    { label: 'NOC for Internship / Passport', amount: 0, note: 'Free — Dean Student Welfare', currency: '₹' },
  ]},
];

export default function FeeCalculator({ onClose }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const [selected, setSelected] = useState({});
  const [expanded, setExpanded] = useState({ 'Certificates & Documents': true });

  const toggleItem = (catLabel, itemLabel, amount) => {
    const key = `${catLabel}::${itemLabel}`;
    setSelected(s => ({ ...s, [key]: s[key] ? undefined : { label: itemLabel, amount, cat: catLabel } }));
  };

  const cartItems = Object.values(selected).filter(Boolean);
  const total = cartItems.reduce((s, i) => s + i.amount, 0);

  const toggleExpand = (cat) => setExpanded(e => ({ ...e, [cat]: !e[cat] }));

  return (
    <Paper sx={{
      borderRadius: 4,
      border: isDark ? '1px solid rgba(16,185,129,0.25)' : '1px solid #a7f3d0',
      bgcolor: isDark ? 'rgba(17,24,39,0.92)' : '#ffffff',
      overflow: 'hidden',
      boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 12px 40px rgba(16,185,129,0.1)',
      maxHeight: '88vh', overflowY: 'auto',
    }}>
      {/* Header */}
      <Box sx={{
        px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 2,
        background: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(6,182,212,0.08))',
        borderBottom: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #a7f3d0',
        position: 'sticky', top: 0, zIndex: 2,
        backdropFilter: 'blur(12px)',
      }}>
        <Avatar sx={{ background: 'linear-gradient(135deg, #10b981, #059669)', width: 42, height: 42, flexShrink: 0 }}>
          <PaymentsIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={800}>DTU Fee Calculator</Typography>
          <Typography variant="caption" color="text.secondary">Select all the services you need — get exact total</Typography>
        </Box>
        {cartItems.length > 0 && (
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" color="text.secondary" display="block">Total</Typography>
            <Typography variant="h6" fontWeight={900} color="success.main" lineHeight={1}>₹{total.toLocaleString('en-IN')}</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ p: 3 }}>
        {/* Fee categories */}
        <Stack spacing={2} mb={3}>
          {FEE_ITEMS.map(cat => (
            <Paper key={cat.category} sx={{
              borderRadius: 3, overflow: 'hidden',
              border: isDark ? '1px solid rgba(255,255,255,0.07)' : '1px solid #e2e8f0',
              bgcolor: isDark ? 'rgba(255,255,255,0.02)' : '#fafafa',
            }}>
              <Box
                onClick={() => toggleExpand(cat.category)}
                sx={{
                  px: 2, py: 1.5, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f1f5f9',
                  '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.07)' : '#e2e8f0' },
                }}
              >
                <Typography variant="body2" fontWeight={800}>{cat.category}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {cat.items.some(i => selected[`${cat.category}::${i.label}`]) && (
                    <Chip label={cat.items.filter(i => selected[`${cat.category}::${i.label}`]).length + ' selected'} size="small"
                      sx={{ fontWeight: 700, height: 20, fontSize: 11, bgcolor: isDark ? 'rgba(16,185,129,0.2)' : '#d1fae5', color: '#10b981' }} />
                  )}
                  <ExpandMoreIcon sx={{ fontSize: 18, color: 'text.secondary', transform: expanded[cat.category] ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </Box>
              </Box>

              <Collapse in={!!expanded[cat.category]}>
                <Box sx={{ p: 1.5 }}>
                  <Stack spacing={0.5}>
                    {cat.items.map(item => {
                      const key = `${cat.category}::${item.label}`;
                      const isSelected = !!selected[key];
                      return (
                        <Box
                          key={item.label}
                          onClick={() => toggleItem(cat.category, item.label, item.amount)}
                          sx={{
                            px: 1.5, py: 1.2, borderRadius: 2.5, cursor: 'pointer',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: isSelected ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
                            bgcolor: isSelected ? (isDark ? 'rgba(16,185,129,0.1)' : '#f0fdf4') : 'transparent',
                            transition: 'all 0.15s',
                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.04)' : '#f8fafc', borderColor: '#10b981' },
                          }}
                        >
                          <Box>
                            <Typography variant="body2" fontWeight={isSelected ? 700 : 500} fontSize={13}>{item.label}</Typography>
                            <Typography variant="caption" color="text.secondary">{item.note}</Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right', flexShrink: 0, ml: 2 }}>
                            <Typography variant="body2" fontWeight={800}
                              sx={{ color: item.amount === 0 ? '#10b981' : 'text.primary' }}>
                              {item.amount === 0 ? 'FREE' : `₹${item.amount.toLocaleString('en-IN')}`}
                            </Typography>
                            {isSelected && <Typography variant="caption" color="success.main" fontWeight={700}>✓ Added</Typography>}
                          </Box>
                        </Box>
                      );
                    })}
                  </Stack>
                </Box>
              </Collapse>
            </Paper>
          ))}
        </Stack>

        {/* Cart summary */}
        {cartItems.length > 0 ? (
          <Fade in>
            <Paper sx={{
              p: 2.5, borderRadius: 3, position: 'sticky', bottom: 0,
              border: isDark ? '1px solid rgba(16,185,129,0.3)' : '1px solid #a7f3d0',
              bgcolor: isDark ? 'rgba(17,24,39,0.95)' : '#ffffff',
              backdropFilter: 'blur(16px)',
              boxShadow: isDark ? '0 -8px 24px rgba(0,0,0,0.3)' : '0 -8px 24px rgba(16,185,129,0.08)',
            }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase" letterSpacing={0.8} display="block" mb={1.5}>
                Your Estimate
              </Typography>
              <Stack spacing={0.8} mb={2}>
                {cartItems.map(item => (
                  <Box key={item.label} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {item.amount === 0 ? 'FREE' : `₹${item.amount.toLocaleString('en-IN')}`}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ mb: 1.5, borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#e2e8f0' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography fontWeight={800} fontSize={15}>Total to Pay</Typography>
                <Typography variant="h5" fontWeight={900} color="success.main">₹{total.toLocaleString('en-IN')}</Typography>
              </Box>
              <Alert severity="info" sx={{ mt: 1.5, borderRadius: 2.5, fontSize: 12, py: 0.5 }}>
                Pay via DTU Bank Challan at SBI DTU Branch or online through DTU fee portal.
              </Alert>
              <Button variant="text" size="small" onClick={() => setSelected({})}
                sx={{ mt: 1, color: 'text.secondary', fontWeight: 700, borderRadius: 2 }}>
                Clear All
              </Button>
            </Paper>
          </Fade>
        ) : (
          <Box sx={{ textAlign: 'center', py: 3, color: 'text.disabled' }}>
            <ReceiptIcon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body2" fontWeight={600}>Select items above to calculate your total</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
