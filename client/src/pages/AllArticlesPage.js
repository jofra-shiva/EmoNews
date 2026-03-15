import React, { useState } from 'react';
import { MdSearch, MdAdd, MdEdit, MdDelete, MdPublish, MdFilterList, MdVisibility } from 'react-icons/md';
import { Link } from 'react-router-dom';
import './AllArticlesPage.css';

const MOCK_ARTICLES = [
  { id: 1, title: 'AI Revolution: How Machine Learning is Reshaping Industries', category: 'Technology', status: 'Published', views: 24500, date: 'Mar 15, 2026', img: 'https://images.unsplash.com/photo-1620712943543-bcc4628c6bb8?w=50&h=50&fit=crop' },
  { id: 2, title: 'Global Markets React to Fed Interest Rate Decision', category: 'Business', status: 'Published', views: 18200, date: 'Mar 14, 2026', img: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=50&h=50&fit=crop' },
  { id: 3, title: 'Breakthrough Cancer Treatment Shows 95% Success Rate', category: 'Health', status: 'Draft', views: 15800, date: 'Mar 13, 2026', img: 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=50&h=50&fit=crop' },
  { id: 4, title: 'SpaceX Artemis Mission Launches Next-Gen Lunar Rovers', category: 'Science', status: 'Published', views: 12300, date: 'Mar 12, 2026', img: 'https://images.unsplash.com/photo-1541185933-ef5d896f7e17?w=50&h=50&fit=crop' },
  { id: 5, title: 'India Wins T20 World Cup in Thrilling Final', category: 'Sports', status: 'Published', views: 11700, date: 'Mar 11, 2026', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=50&h=50&fit=crop' },
  { id: 6, title: 'The Future of Remote Work in 2026', category: 'Business', status: 'Draft', views: 8200, date: 'Mar 10, 2026', img: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=50&h=50&fit=crop' },
  { id: 7, title: 'React 19 Released: What\'s New for Developers', category: 'Technology', status: 'Published', views: 7400, date: 'Mar 09, 2026', img: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=50&h=50&fit=crop' },
  { id: 8, title: 'Mediterranean Diet Study: 10-Year Results', category: 'Health', status: 'Unpublished', views: 5600, date: 'Mar 08, 2026', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=50&h=50&fit=crop' },
];

const CATEGORIES = ['All', 'Technology', 'Business', 'Health', 'Science', 'Sports'];

const AllArticlesPage = () => {
  const [articles, setArticles] = useState(MOCK_ARTICLES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const filtered = articles
    .filter(a => (category === 'All' || a.category === category))
    .filter(a => a.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'views' ? b.views - a.views : new Date(b.date) - new Date(a.date));

  const handleDelete = (id) => {
    if (window.confirm('Delete this article?')) {
      setArticles(prev => prev.filter(a => a.id !== id));
    }
  };

  const handleTogglePublish = (id) => {
    setArticles(prev => prev.map(a =>
      a.id === id ? { ...a, status: a.status === 'Published' ? 'Unpublished' : 'Published' } : a
    ));
  };

  return (
    <div className="articles-page">
      {/* Header */}
      <div className="articles-page__header">
        <div>
          <h2>All Articles</h2>
          <p>{filtered.length} articles found</p>
        </div>
        <Link to="/add-article" className="btn-primary">
          <MdAdd /> New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="articles-filters">
        <div className="filter-search">
          <MdSearch />
          <input
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="filter-group">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${category === cat ? 'active' : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="filter-sort">
          <MdFilterList />
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="date">Latest First</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-card">
        <div className="table-wrapper">
          <table className="articles-table articles-table--full">
            <thead>
              <tr>
                <th>Article</th>
                <th>Category</th>
                <th>Views</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((article, i) => (
                <tr
                  key={article.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 0.04}s` }}
                >
                  <td>
                    <div className="article-title-cell">
                      <img src={article.img} alt="" className="article-thumbnail" />
                      <span className="table-title">{article.title}</span>
                    </div>
                  </td>
                  <td><span className="table-cat">{article.category}</span></td>
                  <td className="table-views"><MdVisibility /> {article.views.toLocaleString()}</td>
                  <td>
                    <span className={`table-status table-status--${article.status.toLowerCase()}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="table-date">{article.date}</td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn action-btn--edit" title="Edit">
                        <MdEdit />
                      </button>
                      <button
                        className="action-btn action-btn--publish"
                        title={article.status === 'Published' ? 'Unpublish' : 'Publish'}
                        onClick={() => handleTogglePublish(article.id)}
                      >
                        <MdPublish />
                      </button>
                      <button
                        className="action-btn action-btn--delete"
                        title="Delete"
                        onClick={() => handleDelete(article.id)}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AllArticlesPage;
