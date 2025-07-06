import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from "./lib/db.js"
import axios from "axios"
import authRoutes from "./routes/auth.route.js";
import geminiRoutes from "./routes/gemini.route.js";

const app=express()
dotenv.config()

const PORT=process.env.PORT 

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5174",
    credentials: true,
}));

app.use('/auth', authRoutes);
app.use('/gemini', geminiRoutes);

app.get('/google-image', async (req, res) => {
    const photoUrl = req.query.url;

    if (!photoUrl) {
        return res.status(400).send('Missing photo URL');
    }

    try {
        const response = await axios.get(photoUrl, {
            responseType: 'stream',
        });

        response.data.pipe(res);
    } catch (error) {
        console.error('Error fetching image from Google:', error);
        res.status(500).send('Error fetching image');
    }
});

app.listen(PORT,()=>{
    console.log("Server is running on PORT "+PORT);
connectDB();
})

