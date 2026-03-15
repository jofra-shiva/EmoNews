import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";

import { detectFaces, drawResults } from '../../helpers/faceApi';
import Button from '../Button/Button';
import Webcam from 'react-webcam';
import './Camera.css';

const API_KEY = 'da7a14e2c2c243b2b921a0a11d732b05';

const Camera = ({ photoMode }) => {
  const camera = useRef(null);
  const cameraCanvas = useRef(null);
  const location = useLocation();
  const [news, setNews] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Performance optimizations
  const isDetectingRef = useRef(false);

  const getNewsForEmotion = useCallback(async (emotion) => {
    if (!emotion) return;

    setIsLoading(true);
    setDetectedEmotion(emotion);

    let query = 'general';
    if (emotion === 'sad') {
      query = 'happiness OR uplifting OR joy OR success OR positive';
    } else if (emotion === 'angry') {
      query = 'comedy OR funny OR jokes OR stand-up OR relaxation';
    } else if (emotion === 'happy' || emotion === 'neutral') {
      query = 'general news OR world technology OR science OR nature OR society';
    } else if (emotion === 'surprised') {
      query = 'amazing facts OR discovery OR space OR breakthrough';
    }

    try {
      const response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: { q: query, language: 'en', pageSize: 12, sortBy: 'relevancy', apiKey: API_KEY }
      });
      setNews(response.data.articles || []);
    } catch (error) {
      console.error("News API Error:", error);
      setNews([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFaces = useCallback(async () => {
    if (isDetectingRef.current || !isCameraOn || !camera.current || !camera.current.video || camera.current.video.readyState !== 4) {
      return;
    }

    isDetectingRef.current = true;
    try {
      const faces = await detectFaces(camera.current.video);

      if (cameraCanvas.current && faces) {
        await drawResults(camera.current.video, cameraCanvas.current, faces);
      }

      if (faces && faces.length > 0) {
        const expressions = faces[0].expressions;
        const dominantEmotion = Object.keys(expressions).reduce((a, b) =>
          expressions[a] > expressions[b] ? a : b
        );

        if (expressions[dominantEmotion] > 0.65) {
          getNewsForEmotion(dominantEmotion);
          setIsCameraOn(false);
        }
      }
    } catch (error) {
      console.error('Detection Error:', error);
    } finally {
      isDetectingRef.current = false;
    }
  }, [isCameraOn, getNewsForEmotion]);

  useEffect(() => {
    let interval;
    if (!photoMode && isCameraOn) {
      interval = setInterval(getFaces, 1000);
    }
    return () => clearInterval(interval);
  }, [photoMode, isCameraOn, getFaces]);

  const MANUAL_EMOTIONS = [
    { id: 'happy', label: '😊 Happy' },
    { id: 'sad', label: '😢 Sad' },
    { id: 'angry', label: '😡 Angry' },
    { id: 'neutral', label: '😐 Neutral' }
  ];

  return (
    <div className="camera animate-fade-in">
      <nav className='App__header'>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <h1>EMONews AI <span className="author-tag">BY SHIVA</span></h1>
        </Link>
        <div className="App__switcher">
          <Link className={classnames('App__switcher-Link', location.pathname !== '/tamil' && 'active')} to='/dashboard'>English</Link>
          <Link className={classnames('App__switcher-Link', location.pathname === '/tamil' && 'active')} to='/tamil'>Tamil</Link>
        </div>
      </nav>

      <div className="main-layout container">
        <aside className="camera-preview">
          <div className="camera__wrapper glass-card small-cam">
            {isCameraOn ? (
              <>
                <Webcam audio={false} ref={camera} width="100%" height="auto" mirrored={true} />
                <canvas className={classnames('webcam-overlay', photoMode && 'webcam-overlay--hidden')} ref={cameraCanvas} />
              </>
            ) : (
              <div className="camera__off">
                <p>{detectedEmotion ? 'ANALYSIS COMPLETE' : 'SYSTEM READY'}</p>
                {detectedEmotion && <div className="last-emotion-tag">{detectedEmotion.toUpperCase()}</div>}
              </div>
            )}
            {isCameraOn && <div className="scanner-bezel"></div>}
          </div>

          <div className="camera__controls">
            <Button onClick={() => setIsCameraOn(!isCameraOn)} className={classnames("toggle-btn btn-small", !isCameraOn && "button--primary")}>
              {isCameraOn ? '🛑 Interrupt Protocol' : '⚡ Initiate AI Analysis'}
            </Button>
          </div>

          <div className="manual-selector glass-card">
            <div className="label">Manual Pulse</div>
            <div className="emotion-buttons">
              {MANUAL_EMOTIONS.map(emo => (
                <button
                  key={emo.id}
                  className={classnames("emo-btn", detectedEmotion === emo.id && `active-${emo.id}`)}
                  onClick={() => getNewsForEmotion(emo.id)}
                  disabled={isLoading}
                >
                  <span role="img" aria-label={emo.id}>{emo.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="emotion-box glass-card">
            <div className="label">Biometric Outcome</div>
            <div className={`value emotion-${detectedEmotion}`}>
              {isLoading ? 'SAMPLING...' : (detectedEmotion ? detectedEmotion.toUpperCase() : 'STANDBY')}
            </div>
          </div>
        </aside>

        <main className="news-feed">
          <div className="section-header">
            <div className="tag">DASHBOARD</div>
            <h2>Mood-Balanced Intel</h2>
          </div>

          <div className="news-grid">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="news-card skeleton-card">
                  <div className="skeleton-img"></div>
                  <div className="skeleton-text-container">
                    <div className="skeleton-title"></div>
                    <div className="skeleton-para"></div>
                  </div>
                </div>
              ))
            ) : (
              news.length > 0 ? (
                news.map((article, index) => (
                  <div key={index} className="news-card animate-fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    {article.urlToImage && <img src={article.urlToImage} alt="News" loading="lazy" />}
                    <div className="news-card-body">
                      <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-card-title">
                        {article.title}
                      </a>
                      <p className="news-card-desc">{article.description}</p>
                      <div className="news-card-footer">
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">Complete Intel →</a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="welcome-state glass-card">
                  <div className="status-badge"><span role="img" aria-label="satellite">📡</span> AWAITING NEURAL SEED</div>
                  <h3>Calibrating Your Perspective</h3>
                  <p>Our neural networks are primed to curate high-fidelity intel based on your emotional frequency. Synchronize your biometric feed below to begin discovery.</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Camera;