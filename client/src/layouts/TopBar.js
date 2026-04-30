import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  MdLightMode,
  MdDarkMode,
  MdMenu,
  MdClose,
} from 'react-icons/md';
import './TopBar.css';

const PAGE_TITLES = {
  '/overview': 'Dashboard',
  '/articles': 'All Articles',
  '/add-article': 'Add Article',
  '/scanner': 'English',
  '/scanner-tamil': 'தமிழ்',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

const TopBar = ({ isDark, onToggleDark, onToggleSidebar, sidebarOpen, collapsed }) => {
  const location = useLocation();
  const isTamil = location.pathname === '/scanner-tamil';
  let title = PAGE_TITLES[location.pathname] || 'EmoNews';

  // Translate specific titles to Tamil if we are in the Tamil scanner route
  if (isTamil) {
    if (location.pathname === '/overview') title = 'முகப்பு';
  }

  return (
    <header className={`topbar ${collapsed ? 'topbar--sidebar-collapsed' : ''}`}>
      {/* Left: Hamburger + Title */}
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <MdClose /> : <MdMenu />}
        </button>
        <div className="topbar__title-group">
          <h1 className="topbar__title">{title}</h1>
          <p className="topbar__date">
            {new Date().toLocaleDateString(isTamil ? 'ta-IN' : 'en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="topbar__right">
        {/* Dark Mode Toggle */}
        <button className="topbar__action-btn" onClick={onToggleDark} aria-label="Toggle dark mode">
          {isDark ? <MdLightMode /> : <MdDarkMode />}
        </button>

        {/* Avatar */}
        <div className="topbar__avatar">
          <span>J</span>
          <div className="topbar__avatar-info">
            <span className="topbar__avatar-name">Jofra</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
