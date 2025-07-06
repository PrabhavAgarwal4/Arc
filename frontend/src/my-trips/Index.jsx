import React, { useEffect, useState, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/store/firebase";
import { noAuthUserNavigation } from "@/store/useAuthStore";
import UserTripCard from "./components/UserTripCard";
import { v4 as uuidv4 } from "uuid";

const Mytrips = () => {
    const { authUser } = useAuthStore();
    const { handleHomeNavigation } = noAuthUserNavigation();
    const [userTrips, setUserTrips] = useState([]);
    const isFetching = useRef(false);

    useEffect(() => {
        if (!isFetching.current) {
            isFetching.current = true;
            GetUserTrips();
        }

        return () => {
            isFetching.current = false;
        };
    }, []);

    const GetUserTrips = async () => {
        const user = authUser ? { ...authUser } : null;

        if (!user) {
            handleHomeNavigation;
            return;
        }

        const q = query(collection(db, "AITrips"), where("userEmail", "==", user.email));
        const querySnapshot = await getDocs(q);
        setUserTrips([]);
        const uniqueTrips = {};

        // Introduce an artificial delay
        await new Promise(resolve => setTimeout(resolve, 500)); // Add 500ms delay

        querySnapshot.forEach((doc) => {
            if (!uniqueTrips[doc.id]) {
                uniqueTrips[doc.id] = { id: uuidv4(), ...doc.data() };
            }
        });

        setUserTrips(Object.values(uniqueTrips));
    };

    return (
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
            <h2 className="font-bold text-3xl">My Trips</h2>
            <div className="grid grid-cols-2 mt-10 md:grid-cols-3 gap-10 mb-10 ">
                {userTrips?.length > 0 ? (
                    userTrips.map((trip) => (
                        <UserTripCard key={trip.id} trip={trip} />
                    ))
                ) : (
                    [1, 2, 3, 4, 5, 6].map((item, index) => (
                        <div key={index} className="h-[180px] w-full bg-slate-200 animate-pulse rounded-xl"></div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Mytrips;

// Key Changes:

// isFetching Ref:

// A useRef variable, isFetching, is used to track whether the data is currently being fetched.
// The useEffect checks this ref to prevent multiple fetches.
// Cleanup Function:

// The useEffect now includes a cleanup function that sets isFetching.current to false.
// uniqueTrips Object:

// An object, uniqueTrips, is used to track unique trips. This avoids multiple setUserTrips calls within the loop.
// setUserTrips Once:

// setUserTrips is called once after all the unique trips are collected, using Object.values(uniqueTrips).
// Debugging Steps:

// Firestore Inspection:

// Critical: Use the Firebase console to inspect the "AITrips" collection and ensure there are no duplicate documents.
// Network Tab:

// Use your browser's "Network" tab to monitor the Firestore requests. See if there are multiple requests being made.
// Console Logs:

// Add more console.log() statements to track the component's render cycle and the GetUserTrips execution.


// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "@/store/useAuthStore";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "@/store/firebase";
// import { noAuthUserNavigation } from "@/store/useAuthStore";
// import UserTripCard from "./components/UserTripCard";
// import { v4 as uuidv4 } from 'uuid';

// const Mytrips = () => {
//   const { authUser } = useAuthStore();
//   const { handleHomeNavigation } = noAuthUserNavigation();
//   const [userTrips, setUserTrips] = useState([]);

//   useEffect(() => {
//     GetUserTrips();
//   }, []);

//   const GetUserTrips = async () => {
//     const user = authUser ? { ...authUser } : null;

//     if (!user) {
//       handleHomeNavigation;
//       return;
//     }

//     setUserTrips([]);

//     const q = query(collection(db, "AITrips"), where("userEmail", "==", user.email));

//     const querySnapshot = await getDocs(q);
//     const uniqueTripIds = new Set(); // Use a Set to track unique doc.ids

//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, " => ", doc.data());

//       if (!uniqueTripIds.has(doc.id)) {
//         uniqueTripIds.add(doc.id);
//         setUserTrips((prevVal) => [...prevVal, { id: uuidv4(), ...doc.data() }]);
//       }
//     });
//   };

//   return (
//     <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
//       <h2 className="font-bold text-3xl"> My Trips</h2>
//       <div>
//         {userTrips.map((trip) => (
//           <UserTripCard key={trip.id} trip={trip} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Mytrips;
// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "@/store/useAuthStore";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "@/store/firebase";
// import { noAuthUserNavigation } from "@/store/useAuthStore";
// import UserTripCard from "./components/UserTripCard";
// import { v4 as uuidv4 } from 'uuid'; // Import uuidv4

// const Mytrips = () => {
//   const { authUser } = useAuthStore();
//   const { handleHomeNavigation } = noAuthUserNavigation();
//   const [userTrips, setUserTrips] = useState([]);

//   useEffect(() => {
//     GetUserTrips();
//   }, []);

//   const GetUserTrips = async () => {
//     const user = authUser ? { ...authUser } : null;

//     if (!user) {
//       handleHomeNavigation;
//       return;
//     }

//     setUserTrips([]);

//     const q = query(collection(db, "AITrips"), where("userEmail", "==", user.email));

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
//       console.log(doc.id, " => ", doc.data());
//       setUserTrips((prevVal) => [...prevVal, { id: uuidv4(), ...doc.data() }]); // Generate uuidv4
//     });
//   };

//   return (
//     <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
//       <h2 className="font-bold text-3xl"> My Trips</h2>
//       <div>
//         {userTrips.map((trip) => (
//           <UserTripCard key={trip.id} trip={trip} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Mytrips;
// import React, { useEffect, useState } from "react";
// import { useAuthStore } from "@/store/useAuthStore";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { db } from "@/store/firebase";
// import { noAuthUserNavigation } from "@/store/useAuthStore";
// // import { initializeApp } from "firebase/app";
// import UserTripCard from "./components/UserTripCard";

// const Mytrips = () => {
//   const { authUser } = useAuthStore();
//   const { handleHomeNavigation } = noAuthUserNavigation();
//   //this extra firebase code is to access db from getFirestore()
// //   const firebaseConfig = {
// //     apiKey: "AIzaSyDy7aXplIM65OWT_LHhFHtcOKUiaHsRIes",
// //     authDomain: "arcc-759fb.firebaseapp.com",
// //     projectId: "arcc-759fb",
// //     storageBucket: "arcc-759fb.firebasestorage.app",
// //     messagingSenderId: "595983790687",
// //     appId: "1:595983790687:web:36f90e41a51ee78ebee1ea",
// //     measurementId: "G-XDVJVLE15Q",
// //   };
// //   const app = initializeApp(firebaseConfig);
// //   const db = getFirestore(app);
 
//   const [userTrips,setUserTrips] = useState([])



//   useEffect(() => {
//     GetUserTrips();
//   }, []);

//   const GetUserTrips = async () => {
//     // const user = authUser;
//     const user = authUser ? { ...authUser } : null; // Create a shallow copy

//     //is user is not authenticated then return
//     if (!user) {
//       handleHomeNavigation;
//       return;
//     }
//     //userTrips is set to empty for new user
//     setUserTrips([]) 
//     //getting all docs of user from firestore

//     const q = query(
//       collection(db, "AITrips"),
//       where("userEmail", "==", user.email)
//     );

//     const querySnapshot = await getDocs(q);
//     querySnapshot.forEach((doc) => {
      
//       console.log(doc.id, " => ", doc.data());
//       setUserTrips(prevVal=>[...prevVal,doc.data()])
//     });
//   };

//   return (
//     <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
//       <h2 className="font-bold text-3xl"> My Trips</h2>
//       <div>
//     {userTrips.map((trip,index)=>(
//     <UserTripCard  key={trip.id} trip={trip} />
//     ))}
//       </div>
//     </div>

//   );
// };

// export default Mytrips;
