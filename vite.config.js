import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'

dotenv.config()

// Connect middleware to handle /api/extract during `npm run dev`
function apiExtractMiddleware() {
  return {
    name: 'api-extract-middleware',
    configureServer(server) {
      server.middlewares.use('/api/extract', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          return res.end(JSON.stringify({ error: 'Method Not Allowed' }))
        }

        try {
          // Read request body
          const buffers = []
          for await (const chunk of req) {
            buffers.push(chunk)
          }
          const rawBody = Buffer.concat(buffers).toString()
          const data = JSON.parse(rawBody || '{}')

          const apiKey = req.headers['x-gemini-api-key'] || process.env.GEMINI_API_KEY

          if (!apiKey) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({
              error: 'GEMINI_API_KEY is not configured on the server. Please set it in your .env file, provide it in the request header, or use Demo Mode.',
              needsKey: true
            }))
          }

          // Dynamic import of our handler logic
          const { processNoticeWithGemini } = await import('./api/extract.js')
          const result = await processNoticeWithGemini({
            apiKey,
            text: data.text,
            imageBase64: data.imageBase64,
            mimeType: data.mimeType || 'image/png',
            languageOption: data.languageOption || 'en'
          })

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result))
        } catch (err) {
          console.error('Extraction error:', err)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            error: err.message || 'Failed to process notice with Gemini AI',
            details: err.stack
          }))
        }
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    apiExtractMiddleware()
  ]
})
