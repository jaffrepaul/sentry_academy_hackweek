import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { RoleProvider } from './contexts/RoleContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <RoleProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </RoleProvider>
    </ThemeProvider>
  </StrictMode>
);
