import React,{useState,useEffect} from 'react'
import giftImage from "/gift.jpg";
import { GetPlaceDetails } from '@/store/globalapi';
import { Link } from 'react-router-dom';

const PHOTO_REF_URL =
    'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' +
    import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const UserTripCard = ({trip}) => {

  const [photoUrl, setPhotoUrl] = useState(null);
  
      useEffect(() => {
          trip && GetPlacePhoto();
      }, [trip]);
  
      const GetPlacePhoto = async () => {
          if (trip?.userSelection?.location?.label) {
              try {
                  const result = await GetPlaceDetails({
                      textQuery: trip?.userSelection?.location?.label,
                  });
  
                  if (
                      result.data.places &&
                      result.data.places[0] &&
                      result.data.places[0].photos &&
                      result.data.places[0].photos[3] &&
                      result.data.places[0].photos[3].name
                  ) {
                      const photoRefName = result.data.places[0].photos[3].name;
                      const generatedPhotoUrl =PHOTO_REF_URL.replace('{NAME}', photoRefName);
  
                      // Fetch from your backend endpoint (port 3001)
                      const response = await fetch(`http://localhost:3001/google-image?url=${encodeURIComponent(generatedPhotoUrl)}`);
  
                      if (!response.ok) {
                          throw new Error(`HTTP error! status: ${response.status}`);
                      }
  
                      const blob = await response.blob();
                      const objectUrl = URL.createObjectURL(blob);
                      setPhotoUrl(objectUrl);
                  } else {
                      console.warn('Photo data not found or invalid.');
                      setPhotoUrl(giftImage);
                  }
              } catch (error) {
                  console.error('Error fetching image:', error);
                  setPhotoUrl(giftImage);
              }
          }
      };

  return (
    <Link to={"/view-trip/"+trip.id}>
    <div className='hover:scale-105 transition-all cursor-pointer'>
      <img src={photoUrl} alt="" className='object-cover rounded-xl h-[180px]'/>
      <div>
        <h2 className='font-bold text-lg'>{trip?.userSelection?.location?.label}</h2>
        <h2 className='text-sm text-gray-500'>{trip?.userSelection?.days} Days trip with {trip?.userSelection?.budget} budget</h2>
      </div>
    </div>
    </Link>
  )
}

export default UserTripCard
