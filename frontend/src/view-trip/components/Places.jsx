import React from 'react';
import PlaceCard from './PlaceCard';

const Places = ({ trip }) => {
    const itineraryObject = trip?.tripData?.itinerary;

    if (!itineraryObject || typeof itineraryObject !== 'object') {
        return <div>No itinerary data available.</div>;
    }

    const itineraryEntries = Object.entries(itineraryObject);

    itineraryEntries.sort((a, b) => {
        const dayA = parseInt(a[0].slice(3));
        const dayB = parseInt(b[0].slice(3));
        return dayA - dayB;
    });

    return (
        <div>
            <h2 className="font-bold text-lg">Places to Visit</h2>
            {itineraryEntries.map(([key, value]) => {
                const dayNumber = parseInt(key.slice(3));
                const places = value.places;

                return (
                    <div key={key}>
                        <div className='mt-5'>
                            <h2 className="text-lg font-bold">Day {dayNumber} : {value.theme}</h2>
                            <div className="grid md:grid-cols-2 gap-5">
                                {places &&
                                    places.map((place) => (
                                        <div key={place.placeName}> {/* Using placeName as key */}
                                            <div className="">
                                                <PlaceCard place={place} />
                                          </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Places;
