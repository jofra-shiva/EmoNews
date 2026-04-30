import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import useDarkMode from '../hooks/useDarkMode';
import './DashboardLayout.css';

const DashboardLayout = ({ children }) => {
  const { isDark, toggleDark } = useDarkMode();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleToggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setMobileOpen(prev => !prev);
    } else {
      setCollapsed(prev => !prev);
    }
  };

  return (
    <div className={`dashboard-layout ${isDark ? 'dark' : ''}`}>
      {/* Overlay for mobile */}
      {mobileOpen && (
        <div className="dashboard-overlay" onClick={() => setMobileOpen(false)} />
      )}

      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(p => !p)}
        className={mobileOpen ? 'sidebar--mobile-open' : ''}
      />

      <div className={`dashboard-main ${collapsed ? 'dashboard-main--collapsed' : ''}`}>
        <TopBar
          isDark={isDark}
          onToggleDark={toggleDark}
          onToggleSidebar={handleToggleSidebar}
          sidebarOpen={mobileOpen}
          collapsed={collapsed}
        />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
