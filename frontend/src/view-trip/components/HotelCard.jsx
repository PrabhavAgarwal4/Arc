import React,{useState,useEffect} from "react";
import { Link } from "react-router-dom";
import giftImage from "/gift.jpg";
import { GetPlaceDetails } from "@/store/globalapi";

const PHOTO_REF_URL =
  "https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=" +
  import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
const HotelCard = ({ hotel }) => {
  const [photoUrl, setPhotoUrl] = useState(null);

  useEffect(() => {
    hotel && GetPlacePhoto();
  }, [hotel]);

  const GetPlacePhoto = async () => {
    if (hotel) {
      try {
        const result = await GetPlaceDetails({
          textQuery: hotel?.hotelName,
        });

        if (
          result.data.places &&
          result.data.places[0] &&
          result.data.places[0].photos &&
          result.data.places[0].photos[5] &&
          result.data.places[0].photos[5].name
        ) {
          const photoRefName = result.data.places[0].photos[5].name;
          const generatedPhotoUrl = PHOTO_REF_URL.replace(
            "{NAME}",
            photoRefName
          );

          // Fetch from your backend endpoint (port 3001)
          const response = await fetch(
            `http://localhost:3001/google-image?url=${encodeURIComponent(
              generatedPhotoUrl
            )}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setPhotoUrl(objectUrl);
        } else {
          console.warn("Photo data not found or invalid.");
          setPhotoUrl(giftImage);
        }
      } catch (error) {
        console.error("Error fetching image:", error);
        setPhotoUrl(giftImage);
      }
    }
  };

  return (
    <Link
      key={hotel.id}
      to={`https://www.google.com/maps/search/?api=1&query='+item?.hotelName+","+item?.hotelAddress}`}
      target="_blank"
    >
      <div className="hover:scale-105 transition-all cursor-pointer">
        <img
          src={photoUrl}
          alt=""
          className="rounded-xl w-full object-cover h-[140px]"
        />
        <div className="my-2 flex flex-col gap-2">
          <h2 className="font-medium">{hotel?.hotelName}</h2>
          <h2 className="text-xs font-medium  text-gray-500">
            📍 {hotel?.hotelAddress}
          </h2>
          <h2 className="text-sm font-medium ">💵 {hotel?.price}</h2>
          <h2 className="text-sm font-medium ">⭐ {hotel?.rating}</h2>
        </div>
      </div>
    </Link>
  );
};

export default HotelCard;
