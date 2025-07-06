import React,{useEffect,useState} from 'react'
import { useParams } from 'react-router-dom';
import {db} from '@/store/firebase.js'
import {doc,getDoc} from 'firebase/firestore'
import toast from 'react-hot-toast';
import Infosection from '../components/Infosection';
import Hotels from '../components/Hotels.jsx';
import Places from '../components/Places';
import Footer from '../components/Footer';
const Viewtrip = () => {
    const { tripid } = useParams();
    const [trip,setTrip] = useState([])
    useEffect(() => {
      tripid && getTripdata()
    }, [tripid])
    
  //fn for getting trip info from firebase 
    const getTripdata=async()=>{
        const docRef=doc(db,'AITrips',tripid);
        const docSnap = await getDoc(docRef)


        if(docSnap.exists()){
            console.log("Document:",docSnap.data())
            setTrip(docSnap.data())
            toast.success("Docs fecthed successfully")
        }else{
            console.log("No such Document");
            toast.error("Chud gye guru")
        }
    }

  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
        {/* //info Section */}
        <Infosection trip={trip}/>
        {/* Recommneded hotels  */}
        <Hotels trip={trip}/>

        {/* daily plans */}
         <Places trip={trip}/>
         {/* footer */}
         <Footer trip={trip}/>
    </div>
  )
}

export default Viewtrip
