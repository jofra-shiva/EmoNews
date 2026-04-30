import React from 'react';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import {
  MdDashboard,
  MdPsychology,
  MdTranslate,
  MdLogout,
  MdChevronLeft,
  MdChevronRight,
} from 'react-icons/md';
import './Sidebar.css';

const Sidebar = ({ collapsed, onToggle, className }) => {
  const history = useHistory();
  const location = useLocation();
  const isTamil = location.pathname === '/scanner-tamil';

  const NAV_ITEMS = [
    { to: '/overview', icon: <MdDashboard />, label: isTamil ? 'முகப்பு' : 'Dashboard' },
    { to: '/scanner', icon: <MdPsychology />, label: isTamil ? 'ஆங்கிலம்' : 'English' },
    { to: '/scanner-tamil', icon: <MdTranslate />, label: isTamil ? 'தமிழ்' : 'தமிழ்' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    history.push('/');
  };

  return (
    <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${className || ''}`}>
      {/* Brand */}
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon">
          <MdPsychology />
        </div>
        {!collapsed && (
          <div className="sidebar__brand-text">
            <span className="sidebar__brand-name">EmoNews</span>
          </div>
        )}
        <button className="sidebar__collapse-btn" onClick={onToggle}>
          {collapsed ? <MdChevronRight /> : <MdChevronLeft />}
        </button>
      </div>

      {/* Nav */}
      <nav className="sidebar__nav">
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
        <button className="sidebar__logout" onClick={handleLogout} title={collapsed ? (isTamil ? 'வெளியேறு' : 'Logout') : ''}>
          <span className="sidebar__link-icon"><MdLogout /></span>
          {!collapsed && <span>{isTamil ? 'வெளியேறு' : 'Logout'}</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
