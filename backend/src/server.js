require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const allowedOrigins = process.env.FRONTEND_URLS
  ? process.env.FRONTEND_URLS.split(',').map((origin) => origin.trim())
  : [process.env.FRONTEND_URL];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/mood', require('./routes/mood'));
app.use('/api/journal', require('./routes/journal'));

app.get('/', (_req, res) => res.json({ message: 'KOMERA API running' }));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`KOMERA API running on http://localhost:${PORT}`));
// Trigger nodemon restart

