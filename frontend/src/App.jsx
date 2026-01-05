import React, { useState } from 'react'
import PredictForm from './components/PredictForm'
import ResultCard from './components/ResultCard'

export default function App() {
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full">
        <header className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">California House Price Predictor</h1>
          <p className="mt-2 text-gray-700">Enter property features and get a predicted price (USD)</p>
        </header>

        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-6 border border-white/60">
          <PredictForm onSuccess={(res) => { setResult(res); setError(null) }} onError={(err) => { setError(err); setResult(null) }} />

          <div className="mt-6">
            <ResultCard result={result} error={error} />
          </div>
        </div>

        <footer className="mt-6 text-center text-sm text-gray-600">Backend endpoint: <code>http://127.0.0.1:5000/predict</code></footer>
      </div>
    </div>
  )
}
