# 🎭 EmoNews: AI Mood-Based News Reader

[![React](https://img.shields.io/badge/React-16.14.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**EmoNews** is a cutting-edge web application that uses real-time facial expression recognition to deliver news articles tailored to your current emotional state. Built with the MERN stack and powered by AI, it bridges the gap between technology and human emotion.

![EmoNews Preview](docs/images/preview.png)

---

## ✨ Features

- 🧠 **Real-Time AI Analysis**: Uses `face-api.js` to detect emotions (Happy, Sad, Angry, Neutral, etc.) directly in your browser.
- 📰 **Contextual News**: Fetches top headlines from NewsAPI filtered by your current mood.
- 🌐 **Multi-Language Support**: Includes a dedicated mode for Tamil news.
- 🔒 **User Authentication**: Secure Login/Register system using MongoDB.
- 🚀 **One-Click Execution**: Simple Python master script to launch both frontend and backend simultaneously.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, `face-api.js`, `react-webcam`, FontAwesome.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose).
- **AI/ML**: Pre-trained convolutional neural networks (CNNs) for facial detection and expression analysis.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally
- [Python 3.x](https://www.python.org/) (for the startup script)
- A **NewsAPI** Key (Get one for free at [newsapi.org](https://newsapi.org/))

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/EmoNews.git
   cd EmoNews
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Configure API Keys**:
   - Get your free key at [newsapi.org](https://newsapi.org/).
   - Open `src/components/Camera/Camera.js` and replace `const API_KEY = '';` (Line 12).
   - *Repeat for `src/components/Cameratamil/Cameratamil.js` (Line 12).*
   - **Tip**: For better security, consider using a `.env` file for your Frontend as well!

---

## 🏃 Running the Project

The easiest way to start both the frontend and backend is using the provided Python script:

```bash
python run.py
```

This will:
1. Start the **Express Backend** on port `3001`.
2. Start the **React Development Server** on port `3000`.
3. Open two separate terminal windows for monitoring logs.

*Alternatively, you can run `npm start` in the root and `npm start` in the `backend` folder manually.*

---

## 📖 How it Works

1. **Face Detection**: The webcam captures your video feed.
2. **Model Processing**: `face-api.js` processes the frames to identify facial landmarks and calculate expression probabilities.
3. **Sentiment Mapping**: The dominant emotion triggers a specific query (e.g., "Happy" -> "Positive/Joyful news").
4. **News Delivery**: A popup modal displays relevant articles fetched via the NewsAPI.

---

## 📁 Project Structure

```text
├── backend/            # Express server and MongoDB models
├── docs/               # Documentation and images
├── public/             # Static assets and face-api models
├── src/                # React application source code
│   ├── components/     # UI Components (Camera, Buttons, etc.)
│   ├── helpers/        # Face API and icon utilities
│   └── App.js          # Main router and entry point
└── run.py              # Master startup script
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 📝 License

This project is licensed under the ISC License.

---
*Created with ❤️ for a more empathetic news experience.*
