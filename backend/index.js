import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { receiptExtractor } from "./gemini-extractor.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/api/upload", async (req, res) => {
  console.log("Route hit");
  try {
      // Handle FormData from mobile app
      let imageUri;
      
      if (req.files && req.files.image) {
          // FormData upload
          const imageFile = req.files.image;
          imageUri = imageFile.tempFilePath || imageFile.data;
          console.log("Received FormData image:", imageFile.name);
      } else if (req.body.photo) {
          // JSON upload (fallback)
          imageUri = req.body.photo.uri;
          console.log("Received JSON image URI");
      } else {
          console.log("No image data received");
          return res.status(400).json({ error: "no_image_provided" });
      }
  
      const result = await receiptExtractor(imageUri);
      console.log(result);
      res.json(result);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "extraction_failed", details: e.message });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
