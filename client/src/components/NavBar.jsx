import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Button, Box, Chip, IconButton, Tooltip, useTheme,
  Menu, MenuItem, ListItemIcon, ListItemText, Divider
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FolderIcon from '@mui/icons-material/Folder';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import TranslateIcon from '@mui/icons-material/Translate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckIcon from '@mui/icons-material/Check';
import { ColorModeContext, LanguageContext } from '../App';
import { getTranslation } from '../translations';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', flag: '🇮🇳' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা', flag: '🇮🇳' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు', flag: '🇮🇳' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்', flag: '🇮🇳' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', flag: '🇮🇳' },
];

export default function NavBar() {
  const location = useLocation();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { language, setLanguage } = useContext(LanguageContext);
  const isDark = theme.palette.mode === 'dark';

  const [langAnchor, setLangAnchor] = useState(null);
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const navLinks = [
    { to: '/', label: getTranslation('navStudent', language), icon: <SchoolIcon sx={{ fontSize: 18 }} /> },
    { to: '/forms', label: getTranslation('navForms', language), icon: <FolderIcon sx={{ fontSize: 18 }} /> },
    { to: '/admin', label: getTranslation('navAdmin', language), icon: <AdminPanelSettingsIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: isDark ? 'rgba(10, 14, 26, 0.88)' : 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
        color: 'text.primary',
        transition: 'all 0.3s ease',
      }}
    >
      <Toolbar sx={{ maxWidth: 1300, width: '100%', mx: 'auto', px: { xs: 2, md: 3 }, py: 0.5 }}>

        {/* DTU Logo + Doc IT Branding */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
          }}
        >
          <Box
            component="img"
            src="/dtu_logo.png"
            alt="DTU Logo"
            sx={{
              height: 44,
              width: 'auto',
              objectFit: 'contain',
              filter: isDark ? 'brightness(1.05) drop-shadow(0 0 8px rgba(99,102,241,0.35))' : 'none',
              transition: 'filter 0.3s',
            }}
          />
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h6"
                fontWeight={900}
                lineHeight={1.2}
                sx={{
                  background: isDark
                    ? 'linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)'
                    : 'linear-gradient(135deg, #1e3a5f 0%, #4338ca 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.03em',
                  fontSize: 20,
                }}
              >
                Doc IT
              </Typography>
              <Chip
                label="DTU AI"
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                  color: 'white',
                  border: 'none',
                }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" lineHeight={1} sx={{ fontSize: 11, fontWeight: 500 }}>
              {getTranslation('brandTagline', language)}
            </Typography>
          </Box>
        </Box>

        {/* Navigation Items */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                startIcon={link.icon}
                variant={isActive ? 'contained' : 'text'}
                color="primary"
                sx={{
                  fontWeight: 600,
                  fontSize: 13,
                  py: 0.8,
                  px: 1.8,
                  borderRadius: 3,
                  ...(isActive
                    ? {}
                    : {
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'text.primary',
                          bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                        },
                      }),
                }}
              >
                {link.label}
              </Button>
            );
          })}

          {/* Language Selector */}
          <Tooltip title="Change Language">
            <Button
              onClick={e => setLangAnchor(e.currentTarget)}
              startIcon={<TranslateIcon sx={{ fontSize: '17px !important' }} />}
              endIcon={<ExpandMoreIcon sx={{ fontSize: '16px !important', ml: -0.5 }} />}
              size="small"
              sx={{
                ml: 0.5,
                px: 1.5,
                py: 0.8,
                borderRadius: 3,
                fontWeight: 700,
                fontSize: 13,
                color: 'text.secondary',
                bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.06)',
                '&:hover': { bgcolor: isDark ? 'rgba(99,102,241,0.15)' : '#eef2ff', color: '#6366f1', borderColor: '#6366f1' },
                gap: 0.3,
              }}
            >
              {currentLang.flag} {currentLang.native}
            </Button>
          </Tooltip>

          <Menu
            anchorEl={langAnchor}
            open={Boolean(langAnchor)}
            onClose={() => setLangAnchor(null)}
            PaperProps={{
              sx: {
                mt: 1,
                borderRadius: 3,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
                bgcolor: isDark ? '#111827' : '#ffffff',
                minWidth: 190,
                boxShadow: isDark ? '0 16px 40px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.1)',
                backgroundImage: 'none',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="caption" fontWeight={800} color="text.disabled" textTransform="uppercase" letterSpacing={0.8}>
                Select Language
              </Typography>
            </Box>
            <Divider sx={{ opacity: 0.1 }} />
            {LANGUAGES.map(lang => (
              <MenuItem
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setLangAnchor(null); }}
                sx={{
                  py: 1,
                  px: 2,
                  borderRadius: 2,
                  mx: 0.5,
                  my: 0.2,
                  fontWeight: language === lang.code ? 800 : 500,
                  color: language === lang.code ? '#6366f1' : 'text.primary',
                  bgcolor: language === lang.code ? (isDark ? 'rgba(99,102,241,0.12)' : '#eef2ff') : 'transparent',
                }}
              >
                <ListItemIcon sx={{ minWidth: 30, fontSize: 18 }}>{lang.flag}</ListItemIcon>
                <ListItemText
                  primary={lang.native}
                  secondary={lang.label}
                  primaryTypographyProps={{ fontWeight: 'inherit', fontSize: 14 }}
                  secondaryTypographyProps={{ fontSize: 11 }}
                />
                {language === lang.code && <CheckIcon sx={{ fontSize: 16, color: '#6366f1' }} />}
              </MenuItem>
            ))}
          </Menu>

          {/* Dark / Light Mode Switcher */}
          <Tooltip title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}>
            <IconButton
              onClick={colorMode.toggleColorMode}
              sx={{
                ml: 0.5,
                width: 40,
                height: 40,
                borderRadius: 3,
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.04)',
                border: isDark ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)',
                color: isDark ? '#facc15' : '#475569',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
                  transform: 'rotate(15deg)',
                },
              }}
            >
              {isDark ? <LightModeIcon sx={{ fontSize: 20 }} /> : <DarkModeIcon sx={{ fontSize: 20 }} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
