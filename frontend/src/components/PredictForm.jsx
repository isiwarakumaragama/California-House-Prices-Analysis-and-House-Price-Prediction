import React, { useState } from 'react'
import axios from 'axios'

// start with empty values so inputs show placeholders (watermarks) instead of defaults
const emptyForm = {
  longitude: '',
  latitude: '',
  housing_median_age: '',
  total_rooms: '',
  population: '',
  households: '',
  median_income: '',
  ocean_proximity: ''
}

const oceanOptions = ['<1H OCEAN', 'INLAND', 'NEAR BAY', 'NEAR OCEAN']

export default function PredictForm({ onSuccess, onError }) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  function validate(values) {
    const e = {}
    const lng = parseFloat(values.longitude)
    const lat = parseFloat(values.latitude)
    const age = parseFloat(values.housing_median_age)
    const rooms = parseFloat(values.total_rooms)
    const pop = parseFloat(values.population)
    const hh = parseFloat(values.households)
    const income = parseFloat(values.median_income)

    if (Number.isNaN(lng) || lng < -124 || lng > -114) e.longitude = 'Longitude must be between -124 and -114'
    if (Number.isNaN(lat) || lat < 32 || lat > 42) e.latitude = 'Latitude must be between 32 and 42'
    if (Number.isNaN(age) || age < 0 || age > 100) e.housing_median_age = 'Housing median age must be between 0 and 100'
    if (Number.isNaN(rooms) || rooms < 0) e.total_rooms = 'Total rooms must be a positive number'
    if (Number.isNaN(pop) || pop < 0) e.population = 'Population must be a positive number'
    if (Number.isNaN(hh) || hh < 0) e.households = 'Households must be a positive number'
    if (Number.isNaN(income) || income < 0) e.median_income = 'Median income must be a positive number'
    if (!oceanOptions.includes(values.ocean_proximity)) e.ocean_proximity = 'Select an ocean proximity option'

    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    setErrors({})
    const validation = validate(form)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    // Build payload: numeric fields + one-hot ocean proximity
    const payload = {
      longitude: parseFloat(form.longitude),
      latitude: parseFloat(form.latitude),
      housing_median_age: parseFloat(form.housing_median_age),
      total_rooms: parseFloat(form.total_rooms),
      population: parseFloat(form.population),
      households: parseFloat(form.households),
      median_income: parseFloat(form.median_income)
    }

    // set one-hot fields
    oceanOptions.forEach(opt => {
      const key = `ocean_proximity_${opt}`
      payload[key] = (form.ocean_proximity === opt) ? 1 : 0
    })

    setLoading(true)
    try {
      const resp = await axios.post('http://127.0.0.1:5000/predict', payload, { headers: { 'Content-Type': 'application/json' } })
      if (resp.data && resp.data.predicted_price !== undefined) {
        onSuccess(resp.data)
      } else if (resp.data && resp.data.error) {
        onError(resp.data.error)
      } else {
        onError('Unexpected response from server')
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Network error'
      onError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Longitude</label>
        <input name="longitude" value={form.longitude} onChange={handleChange} type="number" step="0.0001" placeholder="-124 to -114" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" />
        <p className="text-xs text-gray-500 mt-1">Allowed range: -124 to -114</p>
        {errors.longitude && <p className="text-xs text-red-600 mt-1">{errors.longitude}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Latitude</label>
        <input name="latitude" value={form.latitude} onChange={handleChange} type="number" step="0.0001" placeholder="32 to 42" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" />
        <p className="text-xs text-gray-500 mt-1">Allowed range: 32 to 42</p>
        {errors.latitude && <p className="text-xs text-red-600 mt-1">{errors.latitude}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Housing Median Age</label>
        <input name="housing_median_age" value={form.housing_median_age} onChange={handleChange} type="number" step="1" placeholder="0 to 100" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" />
        <p className="text-xs text-gray-500 mt-1">Allowed range: 0 to 100</p>
        {errors.housing_median_age && <p className="text-xs text-red-600 mt-1">{errors.housing_median_age}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Total Rooms</label>
        <input name="total_rooms" value={form.total_rooms} onChange={handleChange} type="number" step="1" placeholder="positive integer" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" />
        <p className="text-xs text-gray-500 mt-1">Enter the total number of rooms (positive integer)</p>
        {errors.total_rooms && <p className="text-xs text-red-600 mt-1">{errors.total_rooms}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Population</label>
        <input name="population" value={form.population} onChange={handleChange} type="number" step="1" placeholder="positive integer" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" />
        <p className="text-xs text-gray-500 mt-1">Enter the total population for the block</p>
        {errors.population && <p className="text-xs text-red-600 mt-1">{errors.population}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Households</label>
        <input name="households" value={form.households} onChange={handleChange} type="number" step="1" placeholder="positive integer" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" />
        <p className="text-xs text-gray-500 mt-1">Enter the number of households (positive integer)</p>
        {errors.households && <p className="text-xs text-red-600 mt-1">{errors.households}</p>}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Median Income</label>
        <input name="median_income" value={form.median_income} onChange={handleChange} type="number" step="0.001" placeholder="positive (e.g. 8.3)" className="mt-1 block w-full rounded-lg border border-gray-200 bg-white/80 px-3 py-2 shadow-sm focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500" />
        <p className="text-xs text-gray-500 mt-1">Median income (tens of thousands of USD, typical values ~1.5–15)</p>
        {errors.median_income && <p className="text-xs text-red-600 mt-1">{errors.median_income}</p>}
      </div>

      <fieldset className="md:col-span-2">
        <legend className="text-sm font-medium text-gray-700">Ocean Proximity</legend>
        <p className="text-xs text-gray-500 mt-1">Choose the proximity to the ocean for the property</p>
        <div className="mt-2 flex gap-3 flex-wrap items-center">
          {/* placeholder pill when none selected */}
          {form.ocean_proximity === '' && (
            <div className="px-3 py-2 rounded-lg border border-dashed border-gray-300 text-sm text-gray-500 bg-white">Select proximity</div>
          )}

          {oceanOptions.map(opt => (
            <label key={opt} className={`px-3 py-2 rounded-lg border transition transform hover:scale-105 ${form.ocean_proximity === opt ? 'bg-gradient-to-r from-indigo-50 to-indigo-100 border-indigo-300 shadow-sm' : 'bg-white border-gray-200'} cursor-pointer` }>
              <input type="radio" name="ocean_proximity" value={opt} checked={form.ocean_proximity === opt} onChange={handleChange} className="sr-only" />
              <span className="text-sm text-gray-800">{opt}</span>
            </label>
          ))}
        </div>
        {errors.ocean_proximity && <p className="text-xs text-red-600 mt-1">{errors.ocean_proximity}</p>}
      </fieldset>

      <div className="md:col-span-2 flex items-center justify-end gap-3 mt-2">
        <button type="button" onClick={() => setForm(emptyForm)} className="px-4 py-2 rounded-lg bg-gray-100 text-sm hover:bg-gray-200">Reset</button>
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:from-indigo-600 hover:to-pink-600 shadow-md">
          {loading ? 'Predicting...' : 'Predict Price'}
        </button>
      </div>
    </form>
  )
}
