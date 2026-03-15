# 🎭 EmoNews: AI Mood-Based News Reader

[![React](https://img.shields.io/badge/React-16.14.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black?logo=vercel)](https://vercel.com/)

**EmoNews** is a cutting-edge web application that uses real-time facial expression recognition to deliver news articles tailored to your current emotional state. Built with the MERN stack and powered by AI, it bridges the gap between technology and human emotion.

![EmoNews Preview](docs/images/preview.png)

---

## ✨ Features

- 🧠 **Real-Time AI Analysis**: Uses `face-api.js` to detect emotions (Happy, Sad, Angry, Surprised, etc.) directly in your browser.
- 📰 **Contextual News**: Fetches top headlines from NewsAPI filtered by your current mood.
- 🌐 **Multi-Language Support**: Includes a dedicated mode for Tamil news.
- 🔒 **User Authentication**: Secure Login/Register system using MongoDB.
- 🚀 **Integrated Workflow**: New clean folder structure optimized for GitHub and easy deployment.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, `face-api.js`, `react-webcam`, FontAwesome.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI/ML**: Pre-trained convolutional neural networks (CNNs) for facial detection and expression analysis.

---

## 📁 Project Structure

```text
EmoNews/
├── client/              # Frontend React application
│   ├── public/          # Static assets and face-api models
│   ├── src/             # React components and logic
│   └── package.json     # Frontend dependencies
├── server/              # Backend Express server
│   ├── models/          # MongoDB schemas
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
├── docs/                # Project documentation and images
├── package.json         # Root scripts for project management
├── run.py               # Master startup script (Python)
├── vercel.json          # Deployment configuration
└── .gitignore           # Global git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally
- [Python 3.x](https://www.python.org/) (optional, for the startup script)
- A **NewsAPI** Key (Get one for free at [newsapi.org](https://newsapi.org/))

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jofra-shiva/EmoNews.git
   cd EmoNews
   ```

2. **Install all dependencies**:
   We've made it easy! Run this from the root:
   ```bash
   npm run install-all
   ```

3. **Configure API Keys**:
   - Open `client/src/components/Camera/Camera.js` and replace the `API_KEY` (Line 11).
   - *Repeat for `client/src/components/Cameratamil/Cameratamil.js`.*

---

## 🏃 Running the Project

The project is designed to run both frontend and backend simultaneously.

### Option 1: Using Python (Recommended for Windows)
```bash
python run.py
```

### Option 2: Using NPM (Recommended for Mac/Linux)
```bash
npm start
```

---

## 📖 How it Works

1. **Face Detection**: The webcam captures your video feed in real-time.
2. **Model Processing**: `face-api.js` identifies facial landmarks and calculates expression probabilities.
3. **Sentiment Mapping**: The dominant emotion triggers a specific query (e.g., "Sad" -> "Uplifting/Happy news").
4. **News Delivery**: Articles are fetched via NewsAPI and displayed instantly in your dashboard.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Feel free to open issues or submit pull requests.

## 📝 License

This project is licensed under the ISC License.

---
*Created for a more empathetic news experience.*
