import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";

import { detectFaces, drawResults } from '../../helpers/faceApi';
import Button from '../Button/Button';
import Webcam from 'react-webcam';
import '../Camera/Camera.css';

const API_KEY = 'da7a14e2c2c243b2b921a0a11d732b05';

const Cameratamil = ({ photoMode }) => {
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
      query = 'happiness OR uplifting OR joy OR positive OR success';
    } else if (emotion === 'angry') {
      query = 'comedy OR funny OR jokes OR stand-up OR relax';
    } else if (emotion === 'happy' || emotion === 'neutral') {
      query = 'current affairs OR science OR world events OR society';
    }

    try {
      const response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: { q: query, language: 'ta', pageSize: 12, sortBy: 'relevancy', apiKey: API_KEY }
      });

      setNews(response.data.articles || []);
    } catch (error) {
      console.error(error);
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
    { id: 'happy', label: '😊 மகிழ்ச்சி' },
    { id: 'sad', label: '😢 சோகம்' },
    { id: 'angry', label: '😡 கோபம்' },
    { id: 'neutral', label: '😐 அமைதி' }
  ];

  return (
    <div className="camera animate-fade-in">
      <nav className='App__header'>
        <Link to="/tamil" style={{ textDecoration: 'none' }}>
          <h1>EMONews AI (TAMIL) <span className="author-tag">BY SHIVA</span></h1>
        </Link>
        <div className="App__switcher">
          <Link className={classnames('App__switcher-Link', location.pathname !== '/tamil' && 'active')} to='/dashboard'>ENGLISH</Link>
          <Link className={classnames('App__switcher-Link', location.pathname === '/tamil' && 'active')} to='/tamil'>TAMIL</Link>
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
                <p>{detectedEmotion ? 'ஆய்வு முடிந்தது' : 'சிஸ்டம் தயார்'}</p>
                {detectedEmotion && <div className="last-emotion-tag">
                  {detectedEmotion === 'happy' ? 'மகிழ்ச்சி' :
                    detectedEmotion === 'sad' ? 'சோகம்' :
                      detectedEmotion === 'angry' ? 'கோபம்' :
                        detectedEmotion === 'neutral' ? 'அமைதி' :
                          detectedEmotion.toUpperCase()}
                </div>}
              </div>
            )}
            {isCameraOn && <div className="scanner-bezel"></div>}
          </div>
          <div className="camera__controls">
            <Button onClick={() => setIsCameraOn(!isCameraOn)} className={classnames("toggle-btn btn-small", !isCameraOn && "button--primary")}>
              {isCameraOn ? 'நிறுத்து' : 'ஆய்வைத் தொடங்கு'}
            </Button>
          </div>

          <div className="manual-selector glass-card">
            <div className="label">செய்திகளைத் தேர்ந்தெடுக்கவும்</div>
            <div className="emotion-buttons">
              {MANUAL_EMOTIONS.map(emo => (
                <button
                  key={emo.id}
                  className={classnames("emo-btn", detectedEmotion === emo.id && `active-${emo.id}`)}
                  onClick={() => getNewsForEmotion(emo.id)}
                  disabled={isLoading}
                >
                  {emo.label}
                </button>
              ))}
            </div>
          </div>

          <div className="emotion-box glass-card">
            <div className="label">தற்போதைய நிலை</div>
            <div className={`value emotion-${detectedEmotion}`}>
              {isLoading ? 'ஆராய்கிறது...' : (
                detectedEmotion === 'happy' ? 'மகிழ்ச்சி' :
                  detectedEmotion === 'sad' ? 'சோகம்' :
                    detectedEmotion === 'angry' ? 'கோபம்' :
                      detectedEmotion === 'neutral' ? 'அமைதி' :
                        detectedEmotion === 'surprised' ? 'ஆச்சரியம்' :
                          'தயார் நிலையில்'
              )}
            </div>
          </div>
        </aside>

        <main className="news-feed">
          <div className="section-header">
            <div className="tag">DASHBOARD</div>
            <h2>உங்கள் மனநிலைக்கேற்ற செய்திகள்</h2>
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
                        <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">முழு விவரம் →</a>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="welcome-state glass-card">
                  <div className="status-badge">ஆய்வுக்காகக் காத்திருக்கிறது</div>
                  <h3>உங்கள் பார்வையைச் சிஸ்டத்தில் காட்டவும்</h3>
                  <p>"ஆய்வைத் தொடங்கு" பொத்தானை அழுத்தவும். உங்கள் மனநிலை கண்டறியப்பட்டவுடன் செய்திகள் காட்டப்படும்.</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Cameratamil;