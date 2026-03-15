import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import {
  MdDashboard,
  MdArticle,
  MdAddCircle,
  MdPsychology,
  MdTranslate,
  MdBarChart,
  MdSettings,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/overview', icon: <MdDashboard />, label: 'Overview' },
  { to: '/articles', icon: <MdArticle />, label: 'All Articles' },
  { to: '/add-article', icon: <MdAddCircle />, label: 'Add Article' },
  { to: '/scanner', icon: <MdPsychology />, label: 'AI Scanner (EN)' },
  { to: '/scanner-tamil', icon: <MdTranslate />, label: 'AI Scanner (TA)' },
  { to: '/analytics', icon: <MdBarChart />, label: 'Analytics' },
  { to: '/settings', icon: <MdSettings />, label: 'Settings' },
];

const Sidebar = ({ collapsed, onToggle }) => {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    history.push('/');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <MdPsychology />
        </div>
        {!collapsed && (
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">EmoNews</span>
            <span className="sidebar__brand-tag">AI Dashboard</span>
          </div>
        )}
        <button className="sidebar__collapse-btn" onClick={onToggle}>
          {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
        {!collapsed && <div className="sidebar__section-label">MAIN MENU</div>}
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className="sidebar__link"
            activeClassName="sidebar__link--active"
            title={collapsed ? item.label : ''}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            {!collapsed && <span className="sidebar__link-label">{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar__footer">
        <button className="sidebar__logout" onClick={handleLogout} title={collapsed ? 'Logout' : ''}>
          <span className="sidebar__link-icon"><MdLogout /></span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
