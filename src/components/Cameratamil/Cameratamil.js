import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';
import axios from 'axios';
import Modal from 'react-modal';
import { Link } from "react-router-dom";

import { detectFaces, drawResults } from '../../helpers/faceApi';
import Button from '../Button/Button';
import Webcam from 'react-webcam';
import '../Camera/Camera.css';

const API_KEY = 'da7a14e2c2c243b2b921a0a11d732b05';

const Cameratamil = ({ photoMode }) => {
  const camera = useRef(null);
  const cameraCanvas = useRef(null);
  // const [results, setResults] = useState([]);
  const [news, setNews] = useState([]);
  const [detectedEmotion, setDetectedEmotion] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);

  // Function to fetch news based on detected emotion
  const getNewsForEmotion = async (emotion) => {
    setDetectedEmotion(emotion);

    let query = 'general';
    if (emotion === 'happy') query = 'happiness OR positive OR joy';
    else if (emotion === 'sad') query = 'mental health OR depression OR grief';
    else if (emotion === 'angry') query = 'conflict OR war OR protest';
    else if (emotion === 'neutral') query = 'nature OR environment OR peace';

    try {
      const response = await axios.get(`https://newsapi.org/v2/everything`, {
        params: { q: query, language: 'ta', pageSize: 10, apiKey: API_KEY }
      });

      setNews(response.data.articles.slice(0, 10));
      setModalIsOpen(true);
    } catch (error) {
      console.error(error);
      setNews([]);
    }
  };

  // Function to detect faces and their emotions
  const getFaces = async () => {
    if (!isCameraOn || !camera.current || !camera.current.video || camera.current.video.readyState !== 4) {
      return;
    }

    try {
      const faces = await detectFaces(camera.current.video);
      if (cameraCanvas.current) {
        await drawResults(camera.current.video, cameraCanvas.current, faces, 'boxLandmarks');
      }
      // setResults(faces);

      if (faces.length > 0) {
        const detectedExpressions = faces[0].expressions;
        const dominantEmotion = Object.keys(detectedExpressions).reduce((a, b) =>
          detectedExpressions[a] > detectedExpressions[b] ? a : b
        );
        getNewsForEmotion(dominantEmotion);
      }
    } catch (error) {
      console.error('Error detecting faces:', error);
    }
  };


  // Run face detection continuously when in video mode
  useEffect(() => {
    if (!photoMode && isCameraOn) {
      const interval = setInterval(getFaces, 1000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoMode, isCameraOn]);

  return (
    <div className="camera">
      <header className='df-cont'>
        <div className="App__header">
          <h1>
            <span style={{ fontSize: '24px' }} >AI Mood-Based News Reader</span>
          </h1>
          <div className="App__switcher" >
            <Link className='App__switcher-Link' to='/dashboard'>English</Link>
          </div>
        </div>
      </header>
      <div className="camera__controls top">
        <Button onClick={() => setIsCameraOn((prev) => !prev)} className="toggle-btn">
          {isCameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        </Button>
      </div>

      <div className="camera__wrapper">
        {isCameraOn ? (
          <Webcam audio={false} ref={camera} width="100%" height="auto" />
        ) : (
          <div className="camera__off">Camera is Off</div>
        )}
        <canvas className={classnames('webcam-overlay', photoMode && 'webcam-overlay--hidden')} ref={cameraCanvas} />
      </div>

      {/* Emotion-Based News Popup */}
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} className="popup-modal">
        <div className="popup-header">
          <h2>Emotion-Based News</h2>
          <button className="close-btn" onClick={() => setModalIsOpen(false)}>✖</button>
        </div>
        <div className="emotion-label">
          Detected Emotion: <span className={`emotion-${detectedEmotion}`}>{detectedEmotion.toUpperCase()}</span>
        </div>
        <div className="news-container">
          {news.map((article, index) => (
            <div key={index} className="news-item">
              <img src={article.urlToImage || 'https://via.placeholder.com/150'} alt="News" />
              <div className="news-content">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-title">
                  {article.title}
                </a>
                <p className="news-description">{article.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Cameratamil;