import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import admin from 'firebase-admin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Firebase
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname));

// Routes القديمة حقتك
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Routes الجديدة
app.get('/salaries', async (req, res) => {
  try {
    const snapshot = await db.collection('salaries').get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/students', async (req, res) => {
  try {
    const snapshot = await db.collection('students').get();
    res.json(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
