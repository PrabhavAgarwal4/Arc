import axios from 'axios';

const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

const config = {
    headers: {
        'Content-type': 'application/json',
        'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_PLACE_API_KEY,
        'X-Goog-FieldMask': ['places.photos', 'places.displayName', 'places.id'],
    },
};

export const GetPlaceDetails = async (data) => {
    try {
        const response = await axios.post(BASE_URL, data, config);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error details:', error.response);
            if (error.response && error.response.data) {
                console.error('API Error Message:', error.response.data);
            }
        } else {
            console.error('An unexpected error occurred:', error);
        }
        throw error; // Re-throw the error
    }
};