import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const receiptExtractorPrompt = `
    You are a receipt extractor. You are given a receipt image and you need to extract the following information:
    - The name of the item and the price of the item in the receipt
    extract all of those in the following format:
    {
        "item": "item name",
        "upc": "item upc code",
        "price": "item price"
    }
    - if there is no price, then the price should be 0
    - if there is no item, then the item should be "No item"
    - if there is no upc, then the upc should be "null"
    
    IMPORTANT: Return ONLY the raw JSON array without any markdown formatting, code blocks, or additional text. 
    Do not include \`\`\`json or \`\`\` markers. Just return the pure JSON array.
`

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});



export async function receiptExtractor(photo) {
    let base64ImageFile;
    
    // Handle different input types
    if (typeof photo === 'string') {
        // If it's a file path, read the file
        base64ImageFile = fs.readFileSync(photo, {
            encoding: "base64",
        });
    } else if (Buffer.isBuffer(photo)) {
        // If it's a Buffer, convert to base64
        base64ImageFile = photo.toString('base64');
    } else {
        throw new Error('Invalid photo input: expected string (file path) or Buffer');
    }

    const contents = [
        {
            inlineData: {
                data: base64ImageFile,
            }
        },
        {
            text: receiptExtractorPrompt
        }
    ]
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
    });
    return response.text;
}

