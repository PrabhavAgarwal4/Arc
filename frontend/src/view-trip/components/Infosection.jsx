import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { MdShare } from 'react-icons/md';
import giftImage from '/gift.jpg';
import { GetPlaceDetails } from '@/store/globalapi';

const PHOTO_REF_URL =
    'https://places.googleapis.com/v1/{NAME}/media?maxHeightPx=1000&maxWidthPx=1000&key=' +
    import.meta.env.VITE_GOOGLE_PLACE_API_KEY;

const Infosection = ({ trip }) => {
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
        <div>
            <img
  src={photoUrl}
  alt=""
  className="h-[300px] w-full object-cover object-center rounded-xl"
/>
            <div className="flex justify-between items-center">
                <div className="my-5 flex flex-col gap-2">
                    <h2 className="font-bold text-2xl">{trip?.userSelection?.location?.label}</h2>
                    <div className="flex gap-5">
                        <h2 className="p-1 px-3 font-bold bg-gray-200 rounded-full text-gray-500 sm:text-xs md:text-md">
                            🗓️ {trip?.userSelection?.days} Day
                        </h2>
                        <h2 className="p-1 px-3 font-bold bg-gray-200 rounded-full text-gray-500 sm:text-xs md:text-md">
                            💰 {trip?.userSelection?.budget} Budget
                        </h2>
                        <h2 className="p-1 px-3 font-bold bg-gray-200 rounded-full text-gray-500 sm:text-xs md:text-md">
                            🧑🏼‍🤝‍🧑🏼 No. Of Traveler: {trip?.userSelection?.people}
                        </h2>
                    </div>
                </div>
                <Button>
                    <MdShare />
                </Button>
            </div>
        </div>
    );
};

export default Infosection;
