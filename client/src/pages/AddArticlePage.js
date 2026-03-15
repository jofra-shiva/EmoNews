import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { MdSave, MdAutoAwesome, MdImage } from 'react-icons/md';
import './AddArticlePage.css';

const CATEGORIES = ['Technology', 'Business', 'Health', 'Science', 'Sports', 'Entertainment', 'Politics'];

const AddArticlePage = () => {
  const history = useHistory();
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    imageUrl: '',
    status: 'draft',
  });
  const [aiSummary, setAiSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAISummarize = () => {
    if (!form.content) {
      alert('Please enter article content first.');
      return;
    }
    setIsSummarizing(true);
    // Simulated AI summarization
    setTimeout(() => {
      const words = form.content.split(' ').slice(0, 25).join(' ');
      setAiSummary(`${words}... [AI-generated summary based on key insights from the article.]`);
      setIsSummarizing(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Article "${form.title}" saved as ${form.status}!`);
    history.push('/articles');
  };

  return (
    <div className="add-article-page">
      <div className="add-article-page__header">
        <div>
          <h2>Add New Article</h2>
          <p>Create and publish or save as draft</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="article-form">
        <div className="article-form__layout">
          {/* Main Content */}
          <div className="article-form__main">
            <div className="form-card">
              <label className="form-label">Article Title *</label>
              <input
                name="title"
                type="text"
                placeholder="Enter a compelling title..."
                value={form.title}
                onChange={handleChange}
                className="form-input form-input--lg"
                required
              />

              <label className="form-label" style={{ marginTop: '1.5rem' }}>Content *</label>
              <textarea
                name="content"
                placeholder="Write your article content here..."
                value={form.content}
                onChange={handleChange}
                className="form-textarea"
                rows={14}
                required
              />

              {/* AI Summarizer */}
              <div className="ai-summarizer">
                <div className="ai-summarizer__header">
                  <span><MdAutoAwesome /> AI Summarizer</span>
                  <button type="button" className="btn-ai" onClick={handleAISummarize} disabled={isSummarizing}>
                    {isSummarizing ? 'Generating...' : 'Generate Summary'}
                  </button>
                </div>
                {aiSummary && (
                  <div className="ai-summarizer__result">
                    <p>{aiSummary}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Options */}
          <div className="article-form__sidebar">
            <div className="form-card">
              <label className="form-label">Publish Status</label>
              <div className="status-toggle">
                <button
                  type="button"
                  className={`status-option ${form.status === 'draft' ? 'status-option--active' : ''}`}
                  onClick={() => setForm(p => ({ ...p, status: 'draft' }))}
                >
                  <span role="img" aria-label="pencil">📝</span> Draft
                </button>
                <button
                  type="button"
                  className={`status-option ${form.status === 'published' ? 'status-option--active-publish' : ''}`}
                  onClick={() => setForm(p => ({ ...p, status: 'published' }))}
                >
                  <span role="img" aria-label="rocket">🚀</span> Publish
                </button>
              </div>
            </div>

            <div className="form-card">
              <label className="form-label">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} className="form-input" required>
                <option value="">Select category...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label className="form-label" style={{ marginTop: '1rem' }}>Tags</label>
              <input
                name="tags"
                type="text"
                placeholder="e.g. AI, technology, future"
                value={form.tags}
                onChange={handleChange}
                className="form-input"
              />
              <p className="form-hint">Separate tags with commas</p>
            </div>

            <div className="form-card">
              <label className="form-label"><MdImage /> Article Image URL</label>
              <input
                name="imageUrl"
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={form.imageUrl}
                onChange={handleChange}
                className="form-input"
              />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="Preview" className="form-img-preview" onError={e => e.target.style.display = 'none'} />
              )}
            </div>

            <button type="submit" className="btn-primary btn-full">
              <MdSave />
              {form.status === 'published' ? 'Publish Article' : 'Save as Draft'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddArticlePage;
