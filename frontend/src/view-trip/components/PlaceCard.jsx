import React,{useState,useEffect} from 'react'
import giftImage from '/gift.jpg';
import { Button } from '@/components/ui/button';
import { FaMapLocationDot } from "react-icons/fa6";
import { IoTicket } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { GetPlaceDetails } from '@/store/globalapi';
const PHOTO_REF_URL =
    'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' +
    import.meta.env.VITE_GOOGLE_PLACE_API_KEY;


const PlaceCard = ({place}) => {
   const [photoUrl, setPhotoUrl] = useState(null);
  
      useEffect(() => {
          place && GetPlacePhoto();
      }, [place]);
  
      const GetPlacePhoto = async () => {
          if (place) {
              try {
                  const result = await GetPlaceDetails({
                      textQuery: place?.placeName,
                  });
  
                  if (
                      result.data.places &&
                      result.data.places[0] &&
                      result.data.places[0].photos &&
                      result.data.places[0].photos[5] &&
                      result.data.places[0].photos[5].name
                  ) {
                      const photoRefName = result.data.places[0].photos[5].name;
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
    <Link to={'https://www.google.com/maps/search/?api=1&query='+place?.placeName+","+place?.geoCoordinates?.longitude+","+place?.geoCoordinates?.latitude}
    target="_blank"
    >
    <div className='border rounded-xl p-3 mt-2 flex justify-between gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
      <img src={photoUrl} alt="" className='w-[100px] h-[100px] object-cover rounded-xl'/>
<div >
<h2 className="font-bold text-lg ">{place.placeName}</h2>
    <p className='text-sm text-gray-400'>📇 {place.placeDetails}</p>
   
    <p className='text-bold'>🕙 {place.timeTravel}</p>
    <Button size='sm'> <FaMapLocationDot /></Button> 
</div>
    </div>
    </Link>
  )
}

export default PlaceCard
