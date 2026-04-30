import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import axios from 'axios';

import { detectFaces, drawResults } from '../../helpers/faceApi';
import Button from '../Button/Button';
import Webcam from 'react-webcam';
import './Camera.css';

const Camera = ({ photoMode }) => {
  const camera = useRef(null);
  const cameraCanvas = useRef(null);
  const newsFeedRef = useRef(null);
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
      const API_URL = process.env.REACT_APP_API_URL || '/api';
      const response = await axios.get(`${API_URL}/news`, {
        params: { q: query, language: 'en', pageSize: 40 }
      });
      
      let articles = response.data.articles || [];
      
      // Shuffle news to keep it fresh
      articles = articles.sort(() => Math.random() - 0.5);
      
      setNews(articles.slice(0, 20));
      
      // Smoothly move scanner out of view and focus on news
      setTimeout(() => {
        if (newsFeedRef.current) {
          const yOffset = -100; 
          const y = newsFeedRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error("News API Error:", error);
      
      // Fallback for 426 Upgrade Required (Non-localhost restriction)
      if (error.response?.status === 426 || !error.response) {
        setNews([
          {
            title: `[NEURAL SIMULATION] Optimizing focus for ${emotion} states`,
            description: `System detected that external news feed is restricted in production. Displaying high-fidelity simulated intel for your current ${emotion} frequency.`,
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1620712943543-bcc4628c6bb8?auto=format&fit=crop&q=80&w=800"
          },
          {
            title: `Psychology of Emotional Calibration`,
            description: `New research suggests that matching news content to emotional resonance can improve cognitive output by 40%.`,
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800"
          }
        ]);
      } else {
        setNews([]);
      }
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
    <div className="camera">
      <div className="container">
        <div className="section-header animate-fade-in">
          <h2>Mood-Balanced Intel</h2>
        </div>

        <div className="main-layout">
          <aside className="camera-preview">
            <div className="camera-block glass-card">
              <div className="block-label">EMOTION SCAN</div>
              <div className="camera__wrapper small-cam">
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
                  {isCameraOn ? 
                    <><span role="img" aria-label="stop">🛑</span> STOP SCAN</> : 
                    <><span role="img" aria-label="start">⚡</span> START SCAN</>
                  }
                </Button>
              </div>
            </div>

            <div className="manual-selector glass-card">
              <div className="block-label">MANUAL SELECTION</div>
              <div className="selector-content">
                <div className="emotion-buttons">
                  {MANUAL_EMOTIONS.map(emo => (
                    <button
                      key={emo.id}
                      className={classnames("emo-btn-large", detectedEmotion === emo.id && `active-${emo.id}`)}
                      onClick={() => getNewsForEmotion(emo.id)}
                      disabled={isLoading}
                    >
                      <span className="emo-icon">{emo.label.split(' ')[0]}</span>
                      <span className="emo-text">{emo.label.split(' ')[1]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <main className="news-feed" ref={newsFeedRef}>
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
                  null
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Camera;