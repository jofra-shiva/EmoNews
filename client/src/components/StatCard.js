import React from 'react';
import './StatCard.css';

const StatCard = ({ icon, label, value, trend, trendLabel, color = 'primary', delay = 0 }) => {
  const isPositive = trend >= 0;

  return (
    <div
      className={`stat-card stat-card--${color} animate-fade-in`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="stat-card__top">
        <div className="stat-card__icon-wrap">
          {icon}
        </div>
        <div className={`stat-card__trend ${isPositive ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
        </div>
      </div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
      {trendLabel && <div className="stat-card__trend-label">{trendLabel}</div>}
    </div>
  );
};

export default StatCard;
