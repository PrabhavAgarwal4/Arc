# Arc – AI Trip Planner

Arc is a full-stack AI-based trip planning web application developed using the MERN stack. It enables users to register and securely log in to generate custom travel itineraries based on their preferences. The application integrates Gemini AI to generate trip plans and Google Maps API to assist with location-based visualizations.

## Features

- **User Authentication**: Users can register and log in securely using JWT-based authentication.
- **Trip Generation**: Trips are generated dynamically using Gemini AI based on form inputs such as:
  - Destination
  - Budget
  - Number of days
  - Number of travelers
- **Trip History**: Users can view previously generated trips in their account.
- **Interactive Maps**: Google Maps API integration allows users to click on suggested places or hotels to view their exact location.
- **Image Uploads and Profiles**: Cloudinary is used to manage image uploads for user profiles or trip assets.
- **Theme Settings**: UI includes support for changing themes for better user experience.
- **Middleware Security**: Custom middleware functions ensure protected routes and data access control.
- **Axios Integration**: Frontend communicates with the backend via Axios for efficient data fetching and handling.

## Tech Stack

- **Frontend**: React.js, TailwindCSS, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Token)
- **AI Integration**: Gemini AI API
- **Map Integration**: Google Maps API
- **Image Hosting**: Cloudinary

## Project Structure

/frontend → Frontend React application
/backend → Backend Express server and API logic
.env → Environment variables (not committed to version control)

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB URI
- Gemini AI API key
- Google Maps API key
- Cloudinary credentials

## Installation

```bash
# 1. Clone the repository
git clone https://github.com/PrabhavAgarwal4/Arc.git
cd Arc

# 2. Install dependencies
# Backend
cd server
npm install

# Frontend
cd ../client
npm install

#3. Set up  your environment variables
#Backend
GEMINI_API_KEY=your_gemini_api_key
PORT=3001
JWT_SECRET=your_jwt_secret
MONGODB_URL=your_mongodb_connection_string
#Frontend
VITE_GOOGLE_PLACE_API_KEY=your_google_maps_api_key
GEMINI_API_KEY=your_gemini_api_key_for_frontend

# 4. Run the development servers

# Start backend
cd server
npm run dev

# Start frontend
cd ../client
npm start
```
## License 
This project is licensed for educational and personal portfolio use.
