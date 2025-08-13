import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import sharp from "sharp";
import Tesseract from "tesseract.js";
import { receiptExtractor } from "./gemini-extractor.js";

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.post("/api/v1/receipts", async (req, res) => {
    try {
        const file = req.files?.file;
        if (!file) return res.status(400).json({ error: "no_file" });
    
        const result = await receiptExtractor(file);
        res.json(result);
      } catch (e) {
        console.error(e);
        res.status(500).json({ error: "extraction_failed" });
      }
});

app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
