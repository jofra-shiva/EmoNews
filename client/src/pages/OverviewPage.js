import React, { useState } from 'react';
import { MdArticle, MdTrendingUp, MdPeople, MdVisibility, MdBookmark, MdAccessTime } from 'react-icons/md';
import StatCard from '../components/StatCard';
import { VisitorLineChart, PublishingBarChart, CategoryPieChart } from '../components/Charts';
import './OverviewPage.css';

/* ─── Mock Data ─── */
const VISITOR_DATA = [
  { day: 'Mon', visitors: 820, pageViews: 1200 },
  { day: 'Tue', visitors: 1100, pageViews: 1800 },
  { day: 'Wed', visitors: 940, pageViews: 1400 },
  { day: 'Thu', visitors: 1380, pageViews: 2100 },
  { day: 'Fri', visitors: 1600, pageViews: 2500 },
  { day: 'Sat', visitors: 1200, pageViews: 1700 },
  { day: 'Sun', visitors: 980, pageViews: 1350 },
];

const PUBLISHING_DATA = [
  { day: 'Mon', articles: 4, drafts: 2 },
  { day: 'Tue', articles: 7, drafts: 3 },
  { day: 'Wed', articles: 5, drafts: 1 },
  { day: 'Thu', articles: 9, drafts: 4 },
  { day: 'Fri', articles: 11, drafts: 2 },
  { day: 'Sat', articles: 6, drafts: 3 },
  { day: 'Sun', articles: 3, drafts: 1 },
];

const CATEGORY_DATA = [
  { name: 'Technology', value: 38 },
  { name: 'Health', value: 22 },
  { name: 'Business', value: 18 },
  { name: 'Sports', value: 12 },
  { name: 'Science', value: 10 },
];

const TRENDING_ARTICLES = [
  { id: 1, title: 'AI Revolution: How Machine Learning is Reshaping Industries', category: 'Technology', views: 24500, time: '2h ago', img: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6bb8?w=60&h=60&fit=crop' },
  { id: 2, title: 'Global Markets React to Fed Interest Rate Decision', category: 'Business', views: 18200, time: '4h ago', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=60&h=60&fit=crop' },
  { id: 3, title: 'Breakthrough Cancer Treatment Shows 95% Success Rate', category: 'Health', views: 15800, time: '6h ago', img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=60&h=60&fit=crop' },
  { id: 4, title: 'SpaceX Artemis Mission Launches Next-Gen Lunar Rovers', category: 'Science', views: 12300, time: '8h ago', img: 'https://images.unsplash.com/photo-1541185933-ef5d896f7e17?w=60&h=60&fit=crop' },
  { id: 5, title: 'India Wins T20 World Cup in Thrilling Final Against Australia', category: 'Sports', views: 11700, time: '10h ago', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=60&h=60&fit=crop' },
];

const RECENT_ARTICLES = [
  { id: 1, title: 'React 19 Released: What\'s New for Developers', status: 'Published', category: 'Technology', date: 'Mar 15, 2026' },
  { id: 2, title: 'The Future of Remote Work in 2026', status: 'Draft', category: 'Business', date: 'Mar 14, 2026' },
  { id: 3, title: 'Best Diets for Emotional Wellbeing', status: 'Published', category: 'Health', date: 'Mar 13, 2026' },
  { id: 4, title: 'Quantum Computing: Are We There Yet?', status: 'Published', category: 'Science', date: 'Mar 12, 2026' },
];

const STAT_CARDS = [
  { icon: <MdArticle />, label: 'Total Articles', value: '2,847', trend: 12, trendLabel: 'vs last month', color: 'primary' },
  { icon: <MdVisibility />, label: 'Total Views', value: '124.5K', trend: 8.3, trendLabel: 'vs last week', color: 'success' },
  { icon: <MdPeople />, label: 'Active Users', value: '3,291', trend: -2.1, trendLabel: 'vs yesterday', color: 'warning' },
  { icon: <MdTrendingUp />, label: 'Trending Now', value: '47', trend: 15.6, trendLabel: 'articles trending', color: 'info' },
];

const OverviewPage = () => {
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('emonews-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (id) => {
    setBookmarks(prev => {
      const next = prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id];
      localStorage.setItem('emonews-bookmarks', JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="overview-page">
      {/* Stat Cards */}
      <section className="overview-section">
        <div className="stat-grid">
          {STAT_CARDS.map((card, i) => (
            <StatCard key={i} {...card} delay={i * 0.08} />
          ))}
        </div>
      </section>

      {/* Charts Row 1 */}
      <section className="overview-section">
        <div className="charts-grid charts-grid--2-1">
          <VisitorLineChart data={VISITOR_DATA} />
          <PublishingBarChart data={PUBLISHING_DATA} />
        </div>
      </section>

      {/* Charts Row 2 + Trending */}
      <section className="overview-section">
        <div className="charts-grid charts-grid--1-2">
          <CategoryPieChart data={CATEGORY_DATA} />

          {/* Trending Articles */}
          <div className="trending-card">
            <div className="trending-card__header">
              <h3><span role="img" aria-label="fire">🔥</span> Trending Articles</h3>
              <span className="chart-card__tag chart-card__tag--primary">Live</span>
            </div>
            <div className="trending-list">
              {TRENDING_ARTICLES.map((article, i) => (
                <div
                  key={article.id}
                  className="trending-item animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <span className="trending-item__rank">#{i + 1}</span>
                  <img src={article.img} alt="" className="trending-item__img" />
                  <div className="trending-item__content">
                    <p className="trending-item__title">{article.title}</p>
                    <div className="trending-item__meta">
                      <span className="trending-item__cat">{article.category}</span>
                      <span><MdVisibility /> {article.views.toLocaleString()}</span>
                      <span><MdAccessTime /> {article.time}</span>
                    </div>
                  </div>
                  <button
                    className={`trending-item__bookmark ${bookmarks.includes(article.id) ? 'active' : ''}`}
                    onClick={() => toggleBookmark(article.id)}
                    title={bookmarks.includes(article.id) ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <MdBookmark />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Articles Table */}
      <section className="overview-section">
        <div className="table-card">
          <div className="table-card__header">
            <h3>Recent Articles</h3>
            <a href="/articles" className="table-card__link">View All →</a>
          </div>
          <div className="table-wrapper">
            <table className="articles-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ARTICLES.map((article, i) => (
                  <tr key={article.id}>
                    <td className="table-rank">{i + 1}</td>
                    <td className="table-title">{article.title}</td>
                    <td><span className="table-cat">{article.category}</span></td>
                    <td>
                      <span className={`table-status table-status--${article.status.toLowerCase()}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="table-date">{article.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverviewPage;
