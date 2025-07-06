//This file contains all the routes related to user authentication and making
import express from "express";
const router = express.Router()
import {generateTrip} from "../controllers/gemini.controller.js";
 
router.post('/generate', generateTrip);

export default router;
