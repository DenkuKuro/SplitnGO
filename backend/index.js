import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { receiptExtractor } from "./gemini-extractor.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.post("/api/upload", async (req, res) => {
    try {
        const photo = req.body.photo;
        if (!photo) return res.status(400).json({ error: "no_photo" });
    
        const result = await receiptExtractor(photo.uri);
        console.log(result);
        res.json(result);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "extraction_failed" });
      }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
