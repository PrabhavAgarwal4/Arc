// controllers/geminiController.js
// const { GoogleGenerativeAI } = require("@google/generative-ai");
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv'
dotenv.config()
export  const generateTrip = async (req, res) => {
  try {
    const { prompt } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;
// const apiKey='AIzaSyBpATjHTfkMoaJNgKc70XNGE4aK-GF-3HQ'
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chatHistory = [
      {
        role: "user",
        parts: [
          { text: "Generate Travel Plan for Location : Las Vegas, for 3 Days for 2 people with a Cheap budget .Give me a Hotels options list with Hotel Name, Hotel Address, Price, Hotel Image URL, geo coordinates, rating, descriptions and suggest itinerary with Place Name, Place Details, Place Image URL, Geo Coordinates, ticket Pricing, Rating, Time travel each of the location for 3 days with each day plan with best time to visit in JSON format" },
        ],
      },
      {
        role: "model",
        parts: [
          { text: `Okay, here's a JSON format travel plan for a couple on a budget trip to Las Vegas for 3 days. I'll include hotel options, a suggested itinerary with cost-effective activities, and relevant details.\n\n\`\`\`json\n{\n  "tripName": "Las Vegas Budget Getaway for Couples",\n  "duration": "3 Days\",\n  \"budget\": \"Cheap/Budget-Friendly\",\n  \"travelers\": \"Couple\",\n  \"location\": "Las Vegas, Nevada\",\n  \"currency\": \"USD\",\n  \"hotelOptions\": [ ... (rest of the json response) ...]\n}\n\`\`\`` },
        ],
      },
    ];

    const generationConfig = {
      temperature: 0.7,
      maxOutputTokens: 8192,
      topP: 0.9,
      topK: 40,
      responseMimeType: "application/json"
    };

    const chat = model.startChat({
      history: chatHistory,
      generationConfig,
    });

    const result = await chat.sendMessage(prompt);
    const responseText = result.response.text();
    res.json({ text: responseText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};