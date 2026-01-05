import React from 'react'

export default function ResultCard({ result, error }) {
  if (error) {
    return (
      <div className="rounded-xl p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 shadow-sm">
        <p className="text-sm font-medium text-red-800">⚠️ Error: {String(error)}</p>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="rounded-xl p-4 bg-white/60 border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-600">Enter features and click <span className="font-medium">Predict</span> to see the result.</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 shadow-md">
      <h3 className="text-xl font-semibold text-emerald-800">Predicted Price</h3>
      <p className="mt-3 text-4xl font-extrabold text-gray-900 tracking-tight">${result.predicted_price.toLocaleString()}</p>
      <p className="mt-1 text-sm text-gray-600">Estimated market price (USD)</p>
    </div>
  )
}
