import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MdSearch,
  MdNotificationsNone,
  MdLightMode,
  MdDarkMode,
  MdMenu,
  MdClose,
} from 'react-icons/md';
import './TopBar.css';

const PAGE_TITLES = {
  '/overview': 'Overview',
  '/articles': 'All Articles',
  '/add-article': 'Add Article',
  '/scanner': 'AI Emotion Scanner (English)',
  '/scanner-tamil': 'AI Emotion Scanner (Tamil)',
  '/analytics': 'Analytics',
  '/settings': 'Settings',
};

const NOTIFICATIONS = [
  { id: 1, text: 'News feed updated with 12 new articles', time: '2 min ago', unread: true },
  { id: 2, text: 'AI Scanner detected: Happy emotion', time: '15 min ago', unread: true },
  { id: 3, text: 'Daily analytics report is ready', time: '1 hr ago', unread: false },
];

const TopBar = ({ isDark, onToggleDark, onToggleSidebar, sidebarOpen }) => {
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;
  const title = PAGE_TITLES[location.pathname] || 'EmoNews';

  return (
    <header className="topbar">
      {/* Left: Hamburger + Title */}
      <div className="topbar__left">
        <button className="topbar__menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
          {sidebarOpen ? <MdClose /> : <MdMenu />}
        </button>
        <div className="topbar__title-group">
          <h1 className="topbar__title">{title}</h1>
          <p className="topbar__date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="topbar__right">
        <div className="topbar__search">
          <MdSearch className="topbar__search-icon" />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            className="topbar__search-input"
          />
        </div>

        {/* Dark Mode Toggle */}
        <button className="topbar__action-btn" onClick={onToggleDark} aria-label="Toggle dark mode">
          {isDark ? <MdLightMode /> : <MdDarkMode />}
        </button>

        {/* Notifications */}
        <div className="topbar__notif-wrapper">
          <button
            className="topbar__action-btn"
            onClick={() => setShowNotifications(p => !p)}
            aria-label="Notifications"
          >
            <MdNotificationsNone />
            {unreadCount > 0 && <span className="topbar__notif-badge">{unreadCount}</span>}
          </button>

          {showNotifications && (
            <div className="topbar__notif-dropdown">
              <div className="notif-header">
                <span>Notifications</span>
                <span className="notif-badge-count">{unreadCount} new</span>
              </div>
              {NOTIFICATIONS.map(n => (
                <div key={n.id} className={`notif-item ${n.unread ? 'notif-item--unread' : ''}`}>
                  <div className="notif-item__dot" />
                  <div className="notif-item__body">
                    <p>{n.text}</p>
                    <span>{n.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="topbar__avatar">
          <span>S</span>
          <div className="topbar__avatar-info">
            <span className="topbar__avatar-name">Shiva</span>
            <span className="topbar__avatar-role">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
