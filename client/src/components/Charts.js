import React from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './Charts.css';

export const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#8b5cf6'];

const CustomTooltipStyle = {
  backgroundColor: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
  fontSize: '0.8125rem',
  color: 'var(--text-primary)',
};

/* ─── Line Chart ─── */
export const VisitorLineChart = ({ data }) => (
  <div className="chart-card">
    <div className="chart-card__header">
      <h3>Daily Visitors</h3>
      <span className="chart-card__tag chart-card__tag--primary">This Week</span>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={CustomTooltipStyle} />
        <Line type="monotone" dataKey="visitors" stroke="#6366f1" strokeWidth={3} dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
        <Line type="monotone" dataKey="pageViews" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7 }} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

/* ─── Bar Chart ─── */
export const PublishingBarChart = ({ data }) => (
  <div className="chart-card">
    <div className="chart-card__header">
      <h3>Articles Published</h3>
      <span className="chart-card__tag chart-card__tag--success">This Month</span>
    </div>
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
        <CartesianGrid stroke="var(--border-color)" strokeDasharray="4 4" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={CustomTooltipStyle} />
        <Bar dataKey="articles" fill="#6366f1" radius={[8, 8, 0, 0]} />
        <Bar dataKey="drafts" fill="#e2e8f0" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

/* ─── Pie Chart ─── */
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export const CategoryPieChart = ({ data }) => (
  <div className="chart-card">
    <div className="chart-card__header">
      <h3>Category Distribution</h3>
      <span className="chart-card__tag chart-card__tag--warning">All Time</span>
    </div>
    <div className="chart-pie-wrapper">
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} label={renderCustomLabel} outerRadius={100} dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={CustomTooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div className="chart-pie-legend">
        {data.map((entry, index) => (
          <div key={entry.name} className="chart-pie-legend__item">
            <div className="chart-pie-legend__dot" style={{ background: COLORS[index % COLORS.length] }} />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);
