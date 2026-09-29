import React, { useState, useMemo, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import NavBar from './components/NavBar';
import StudentChat from './components/StudentChat';
import AdminDashboard from './components/AdminDashboard';
import FormsLibrary from './components/FormsLibrary';

export const ColorModeContext = createContext({ toggleColorMode: () => {}, mode: 'dark' });
export const LanguageContext = createContext({ language: 'en', setLanguage: () => {} });

function App() {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('adminplus_theme_mode') || 'dark';
  });

  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('adminplus_language') || 'en';
  });

  const setLanguage = (lang) => {
    localStorage.setItem('adminplus_language', lang);
    setLanguageState(lang);
  };

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const nextMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('adminplus_theme_mode', nextMode);
          return nextMode;
        });
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'dark'
            ? {
                primary: {
                  main: '#6366f1',
                  light: '#818cf8',
                  dark: '#4f46e5',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#ec4899',
                  light: '#f472b6',
                  dark: '#db2777',
                },
                background: {
                  default: '#0a0e1a',
                  paper: '#111827',
                },
                text: {
                  primary: '#f8fafc',
                  secondary: '#94a3b8',
                },
                divider: 'rgba(255, 255, 255, 0.08)',
                success: { main: '#10b981', light: '#34d399', dark: '#059669' },
                warning: { main: '#f59e0b', light: '#fbbf24', dark: '#d97706' },
                info: { main: '#06b6d4', light: '#22d3ee', dark: '#0891b2' },
                error: { main: '#ef4444', light: '#f87171', dark: '#dc2626' },
              }
            : {
                primary: {
                  main: '#4f46e5',
                  light: '#6366f1',
                  dark: '#4338ca',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#db2777',
                  light: '#f472b6',
                  dark: '#be185d',
                },
                background: {
                  default: '#f8fafc',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#0f172a',
                  secondary: '#64748b',
                },
                divider: 'rgba(0, 0, 0, 0.08)',
                success: { main: '#059669', light: '#10b981', dark: '#047857' },
                warning: { main: '#d97706', light: '#f59e0b', dark: '#b45309' },
                info: { main: '#0284c7', light: '#0ea5e9', dark: '#0369a1' },
                error: { main: '#dc2626', light: '#ef4444', dark: '#b91c1c' },
              }),
        },
        typography: {
          fontFamily: '"Plus Jakarta Sans", -apple-system, sans-serif',
          h4: { fontWeight: 800, letterSpacing: '-0.02em' },
          h5: { fontWeight: 700, letterSpacing: '-0.01em' },
          h6: { fontWeight: 700 },
          subtitle1: { fontWeight: 600 },
          subtitle2: { fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        shape: { borderRadius: 14 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                padding: '8px 20px',
                fontWeight: 600,
                transition: 'all 0.2s ease-in-out',
              },
              containedPrimary: {
                background:
                  mode === 'dark'
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)',
                boxShadow:
                  mode === 'dark'
                    ? '0 4px 14px 0 rgba(99, 102, 241, 0.35)'
                    : '0 4px 14px 0 rgba(79, 70, 229, 0.3)',
                '&:hover': {
                  boxShadow:
                    mode === 'dark'
                      ? '0 6px 20px 0 rgba(99, 102, 241, 0.5)'
                      : '0 6px 20px 0 rgba(79, 70, 229, 0.45)',
                  transform: 'translateY(-1px)',
                },
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: 16,
                backgroundImage: 'none',
                border:
                  mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.08)'
                    : '1px solid rgba(0, 0, 0, 0.07)',
                boxShadow:
                  mode === 'dark'
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                fontWeight: 600,
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <LanguageContext.Provider value={{ language, setLanguage }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box
            sx={{
              minHeight: '100vh',
              bgcolor: 'background.default',
              color: 'text.primary',
              position: 'relative',
            }}
          >
            <BrowserRouter>
              <NavBar />
              <Routes>
                <Route path="/" element={<StudentChat />} />
                <Route path="/forms" element={<FormsLibrary />} />
                <Route path="/admin" element={<AdminDashboard />} />
              </Routes>
            </BrowserRouter>
          </Box>
        </ThemeProvider>
      </LanguageContext.Provider>
    </ColorModeContext.Provider>
  );
}

export default App;
