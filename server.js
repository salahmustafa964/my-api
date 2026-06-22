import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import admin from "firebase-admin";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// نقرا المفتاح من Render
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get("/", (req, res) => {
  res.send("API is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
