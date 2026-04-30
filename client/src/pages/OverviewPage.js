import React from 'react';
import { useHistory } from 'react-router-dom';
import { MdPsychology, MdTranslate, MdArrowForward } from 'react-icons/md';
import './OverviewPage.css';

const OverviewPage = () => {
  const history = useHistory();

  return (
    <div className="overview-page welcome-dashboard">
      <div className="welcome-container">
        <header className="welcome-header animate-fade-in">
          <h1 className="welcome-title">Welcome back, Jofra</h1>
          <p className="welcome-subtitle">Your personal intel hub is ready. How would you like to explore today?</p>
        </header>

        <div className="selection-grid">
          {/* English Scanner Card */}
          <div className="action-card premium-shadow animate-fade-in" style={{ animationDelay: '0.1s' }} onClick={() => history.push('/scanner')}>
            <div className="action-card__icon icon-en">
              <MdPsychology />
            </div>
            <div className="action-card__content">
              <h3>English Scanner</h3>
              <p>Analyze your current emotional frequency and receive high-fidelity English intel.</p>
              <div className="action-card__footer">
                <span>Start Scanning</span>
                <MdArrowForward />
              </div>
            </div>
          </div>

          {/* Tamil Scanner Card */}
          <div className="action-card premium-shadow animate-fade-in" style={{ animationDelay: '0.2s' }} onClick={() => history.push('/scanner-tamil')}>
            <div className="action-card__icon icon-ta">
              <MdTranslate />
            </div>
            <div className="action-card__content">
              <h3>Tamil Scanner</h3>
              <p>உங்கள் மனநிலையை பகுப்பாய்வு செய்து தமிழ் செய்திகளைப் பெறுங்கள்.</p>
              <div className="action-card__footer">
                <span>ஸ்கேன் தொடங்கவும்</span>
                <MdArrowForward />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OverviewPage;
