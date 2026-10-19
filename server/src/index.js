import 'dotenv/config'
import express from 'express'

const app = express()

app.get('/api/health', (req, res) => {
  res.json({ ok: true })
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))
