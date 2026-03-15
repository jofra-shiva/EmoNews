import * as faceapi from 'face-api.js';

export const loadModels = () => {
  const MODEL_URL = `${process.env.PUBLIC_URL}/models`;

  return Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
    faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    faceapi.nets.ageGenderNet.loadFromUri(MODEL_URL),
  ]);
};

// Optimization: Use higher threshold for faster, more accurate emotion locked-in
export const detectFaces = async (image) => {
  if (!image || image.readyState < 2) {
    return null;
  }

  try {
    const faces = await faceapi
      .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }))
      .withFaceLandmarks()
      .withFaceExpressions();

    return faces;
  } catch (err) {
    console.error("ML Inference Error:", err);
    return null;
  }
};

export const drawResults = async (image, canvas, results) => {
  if (image && canvas && results) {
    const imgSize = image.getBoundingClientRect();
    const displaySize = { width: imgSize.width, height: imgSize.height };

    faceapi.matchDimensions(canvas, displaySize);

    const resizedResults = faceapi.resizeResults(results, displaySize);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw box with "Bio-Metric" style
    resizedResults.forEach(result => {
      const { detection } = result;
      const box = detection.box;

      // Draw neon box corners instead of full box for better aesthetics
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(box.x, box.y + 20); ctx.lineTo(box.x, box.y); ctx.lineTo(box.x + 20, box.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(box.x + box.width - 20, box.y); ctx.lineTo(box.x + box.width, box.y); ctx.lineTo(box.x + box.width, box.y + 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(box.x + box.width, box.y + box.height - 20); ctx.lineTo(box.x + box.width, box.y + box.height); ctx.lineTo(box.x + box.width - 20, box.y + box.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(box.x + 20, box.height + box.y); ctx.lineTo(box.x, box.height + box.y); ctx.lineTo(box.x, box.y + box.height - 20);
      ctx.stroke();

      // Display Confidence
      ctx.fillStyle = '#6366f1';
      ctx.font = '10px Outfit';
      ctx.fillText(`${(detection.score * 100).toFixed(0)}% Match`, box.x, box.y - 5);
    });
  }
};
