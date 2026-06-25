import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Analyze text for bias
 * @param {string} text - The text to analyze
 * @returns {Promise<{is_biased: boolean, confidence: string, label: string, explanation: string}>}
 */
export async function analyzeText(text) {
  try {
    const response = await client.post('/predict', { text })
    return response.data
  } catch (err) {
    if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
      throw new Error(`Cannot reach the analysis server. Make sure it is running at ${BASE_URL}.`)
    }
    if (err.response) {
      throw new Error(
        err.response.data?.detail ||
        err.response.data?.message ||
        `Server error ${err.response.status}`
      )
    }
    throw new Error(err.message || 'Unknown error occurred')
  }
}
