import React from 'react';
import giftImage from '/gift.jpg';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import HotelCard from './HotelCard';

const Hotels = ({ trip }) => {
    // Create a new array with unique IDs
    const hotelOptionsWithIds = trip?.tripData?.hotelOptions?.map((item) => ({
        ...item,
        id: uuidv4(),
    }));

    return (
        <div>
            <h2 className="font-bold text-xl mt-5 mb-3">Hotel Recommendation</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-7">
                {hotelOptionsWithIds?.map((item) => ( // Use hotelOptionsWithIds here
                    <HotelCard hotel={item} key={item.id}/>
                ))}
            </div>
        </div>
    );
};

export default Hotels;