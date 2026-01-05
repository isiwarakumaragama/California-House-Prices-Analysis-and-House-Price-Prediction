# California House Price Predictor - Frontend

This is a small React + Vite + Tailwind frontend to interact with the backend model server.

Prerequisites
- Node.js 18+ and npm

Install and run (PowerShell):

```powershell
cd "d:\AI projects\California House Prices\frontend"
npm install
npm run dev
```

The dev server will open at `http://localhost:5173` by default. The frontend calls the backend at `http://127.0.0.1:5000/predict` — ensure your backend is running.

Usage
- Fill the property features and click "Predict Price".
- The result card will show the predicted price or an error message.

Developer notes
- Ensure the backend server is running at `http://127.0.0.1:5000/predict` before making predictions.
- If you change tailwind/postcss config, run a fresh `npm install` and restart the dev server.

Troubleshooting (Windows PowerShell)
- If you see Tailwind at-rule warnings in your editor, that's normal in some linters; the dev build with Vite handles Tailwind normally.
- To run the frontend on a different port: set the `PORT` env variable before running dev.

Quick commands (PowerShell):

```powershell
cd "d:\AI projects\California House Prices\frontend"
npm install
npm run dev
```

Notes
- This is a simple scaffold. You can customize styles or convert to TypeScript if desired.
