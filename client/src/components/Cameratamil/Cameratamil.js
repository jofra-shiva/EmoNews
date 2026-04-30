import React, { useState, useEffect, useRef, useCallback } from 'react';
import classnames from 'classnames';
import axios from 'axios';

import { detectFaces, drawResults } from '../../helpers/faceApi';
import Button from '../Button/Button';
import Webcam from 'react-webcam';
import '../Camera/Camera.css';

const API_KEY = 'da7a14e2c2c243b2b921a0a11d732b05';

const Cameratamil = ({ photoMode }) => {
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

    let query = 'தமிழ்நாடு OR இந்தியா OR உலகம் OR செய்திகள் OR இன்றைய செய்திகள்'; // Expanded Tamil keywords
    if (emotion === 'sad') {
      query = 'சிரிப்பு OR நகைச்சுவை OR மகிழ்ச்சி OR வெற்றி OR சாதனை OR நல்ல செய்திகள்';
    } else if (emotion === 'angry') {
      query = 'அமைதி OR தியானம் OR இயற்கை OR ஆன்மீகம் OR ரிலாக்ஸ் OR சுற்றுலா OR தத்துவங்கள்';
    } else if (emotion === 'happy' || emotion === 'neutral') {
      query = 'செய்திகள் OR அரசியல் OR அறிவியல் OR விளையாட்டு OR சினிமா OR தொழில்நுட்பம் OR கல்வி';
    }

    try {
      let response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: { q: query, language: 'ta', pageSize: 100, sortBy: 'publishedAt', apiKey: API_KEY }
      });
 
      let articles = response.data.articles || [];
      
      // Fallback: If no articles found with complex query, try a very simple one
      if (articles.length === 0) {
        console.log("No articles found with primary query, trying fallback...");
        const fallbackQuery = 'தமிழ்நாடு OR செய்திகள்';
        const fallbackResponse = await axios.get(`https://newsapi.org/v2/everything`, {
          params: { q: fallbackQuery, language: 'ta', pageSize: 50, sortBy: 'publishedAt', apiKey: API_KEY }
        });
        articles = fallbackResponse.data.articles || [];
      }
      
      // Shuffle Tamil news
      articles = articles.sort(() => Math.random() - 0.5);
      
      setNews(articles.slice(0, 50));
      
      // Smoothly move scanner out of view and focus on news
      setTimeout(() => {
        if (newsFeedRef.current) {
          const yOffset = -100; 
          const y = newsFeedRef.current.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.error("News Fetch Error:", error);
      
      // Fallback for 426 Upgrade Required (Non-localhost restriction)
      if (error.response?.status === 426 || !error.response) {
        setNews([
          {
            title: `[சிமுலேஷன்] ${emotion} நிலைகளுக்கான சிறந்த செய்திகள்`,
            description: `தயாரிப்பு சூழலில் வெளி செய்தி ஊட்டம் கட்டுப்படுத்தப்பட்டுள்ளது. உங்கள் ${emotion} மனநிலைக்கான சிமுலேட்டட் செய்திகள் இங்கே காட்டப்படுகின்றன.`,
            url: "#",
            urlToImage: "https://images.unsplash.com/photo-1620712943543-bcc4628c6bb8?auto=format&fit=crop&q=80&w=800"
          },
          {
            title: `மனநிலை சீரமைப்பு முறைகள்`,
            description: `மனநிலைக்கு ஏற்ற செய்திகளைப் பார்ப்பது உங்கள் உற்பத்தித் திறனை 40% வரை அதிகரிக்கும் என ஆய்வுகள் கூறுகின்றன.`,
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
    { id: 'happy', label: '😊 மகிழ்ச்சி' },
    { id: 'sad', label: '😢 சோகம்' },
    { id: 'angry', label: '😡 கோபம்' },
    { id: 'neutral', label: '😐 அமைதி' }
  ];

  return (
    <div className="camera">
      <div className="container">
        <div className="section-header animate-fade-in">
          <h2>உங்கள் மனநிலைக்கேற்ற செய்திகள்</h2>
        </div>

        <div className="main-layout">
          <aside className="camera-preview">
            <div className="camera-block glass-card">
              <div className="block-label">உணர்ச்சி ஆய்வு</div>
              <div className="camera__wrapper small-cam">
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
                  {isCameraOn ? '🛑 ஆய்வை நிறுத்து' : '⚡ ஸ்கேன் தொடங்கு'}
                </Button>
              </div>
            </div>

            <div className="manual-selector glass-card">
              <div className="block-label">நேரடித் தேர்வு</div>
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
                          <a href={article.url} target="_blank" rel="noopener noreferrer" className="read-more">முழு விவரம் →</a>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  detectedEmotion && (
                    <div className="no-news-message glass-card animate-fade-in">
                      <div className="no-news-icon"><span role="img" aria-label="satellite">📡</span></div>
                      <h3>மன்னிக்கவும்!</h3>
                      <p>தற்போது உங்கள் மனநிலைக்கான நேரடிச் செய்திகள் கிடைக்கவில்லை. புதிய செய்திகள் அப்டேட் ஆனவுடன் உடனே காண்பிக்கிறோம்.</p>
                      <span className="no-news-status">(Sorry, we will show news once it's updated)</span>
                    </div>
                  )
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Cameratamil;