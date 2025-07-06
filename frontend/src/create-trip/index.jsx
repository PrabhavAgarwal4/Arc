import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from "@/constants/options";
import { React, useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { toast } from 'react-hot-toast';
import { useGeminiStore } from "../store/Gemini";
import { Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from "../store/useAuthStore";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../store/firebase";
const FullScreenLoader = ({ isLoading }) => {
  if (!isLoading) return null;
  
  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="flex flex-col items-center gap-3 p-6 bg-white shadow-lg rounded-2xl">
              <Loader2 className="size-12 animate-spin text-blue-500" />
              <p className="text-lg font-medium text-gray-700">Generating your trip plan...</p>
          </div>
      </div>
  );
};
// const cleanObject = (obj) => {
//     if (typeof obj !== 'object' || obj === null) {
//         return obj === undefined ? null : obj;
//     }

//     if (Array.isArray(obj)) {
//         return obj.map(cleanObject).filter(item => item !== undefined);
//     }

//     return Object.entries(obj).reduce((acc, [key, value]) => {
//         if (value !== undefined) {
//             acc[key] = cleanObject(value);
//         }
//         return acc;
//     }, {});
// };
function CreateTrip() {
    const { handleGenerate, isGenPrompt } = useGeminiStore();
    const { authUser } = useAuthStore();
    const navigate = useNavigate();
    const [place, setPlace] = useState();
    const [formData, setFormData] = useState({});

    // const handleInput = (name, value) => {
    //     setFormData((prevformData) => ({
    //         ...prevformData,
    //         [name]: value,
    //     }));
    // };
    const handleInput = (name, value) => {
        console.log("handleInput: name:", name, "value (string):", value);
        setFormData((prevformData) => {
            const newFormData = {
                ...prevformData,
                [name]: value,
            };
            console.log("handleInput: newFormData:", newFormData);
            return newFormData;
        });
    };

    useEffect(() => {
        console.log(formData);
    }, [formData]);

    const onGenerateTrip = async () => {
        if (!formData?.days || !formData.location || !formData?.budget || !formData?.people) {
            toast.error('Please Enter all required fields.');
            return;
        }
        if (formData?.days > 10) {
            toast.error('Trip duration cannot exceed 10 days.');
            return;
        }
        if (!authUser) {
            toast.error("Please log in to generate a trip.")
            // showPopup();
            navigate('/login'); // Redirect to login if user is not logged in
        }else{
            const FINAL_PROMPT = AI_PROMPT
            .replace('{location}', formData?.location.label)
            .replace('{days}', formData?.days)
            .replace('{people}', formData?.people)
            .replace('{budget}', formData?.budget)
            .replace('{total_days}', formData?.days);

        console.log(FINAL_PROMPT);
        try {
          await handleGenerate(FINAL_PROMPT);
          const { result } = useGeminiStore.getState();
          console.log("Gemini API Result:", result); // Log the entire result
        // console.log("Gemini API Result Response:", result?.response);

        if (result &&  result.text) {
            try {
                const parsedData = JSON.parse(result.text);
                console.log("Parsed Data:", parsedData);
                SaveAiTrip(parsedData);
            } catch (parseError) {
                console.error("Error parsing JSON:", parseError);
                toast.error("Failed to parse trip data.");
            }
        } else {
            console.error("Gemini API response is invalid or missing 'text' property:", result);
            toast.error("Failed to get a valid trip, please try again.");
        }
      } catch (error) {
          console.error("Error fetching Gemini API:", error);
          toast.error("Failed to get a trip, please try again.");
      }
   
    }
    };
    const SaveAiTrip = async (data) => {
        const user = authUser;
        const docId = Date.now().toString();
        console.log("Data in saveAiTrip", data);
        if (data && typeof data === 'object') { // Check if data is an object
            try {
                await setDoc(doc(db, "AITrips", docId), {
                    userSelection: formData,
                    tripData: data, // Store the parsed object directly
                    userEmail: user?.email,
                    id: docId,
                });

                navigate('/view-trip/'+docId);

            } catch (error) {
                console.error("Error saving trip data:", error);
            }
        } else {
            console.error("Invalid data object received:", data);
            toast.error("Invalid data received from Gemini Api");
        }

    };

    return (
        <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
            <h2 className="font-bold text-3xl"> Tell us your travel preferences🌍 </h2>
            <p className="mt-3  text-gray-500">
                Just provide some basic information, and our trip planner will generate
                a customized itinerary based on your preferences.
            </p>

            <div className="mt-10 flex flex-col gap-9">
                <div>
                    <h2 className="text-xl my-3 font-medium">
                        What is the destination of choice?
                    </h2>
                    <GooglePlacesAutocomplete
                        apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
                        selectProps={{
                            place,
                            onChange: (v) => {
                                setPlace(v);
                                handleInput('location', v);
                            },
                        }}
                    />
                    <div>
                        <h2 className="text-xl my-3 font-medium">
                            {" "}
                            How many days are you planning for trip?
                        </h2>
                        {/* <Input placeholder={"Ex.3"} type="number"
                            onChange={(e) => {
                                handleInput('days', e.target.value);
                            }} /> */}
                            <Input
    placeholder={"Ex.3"}
    type="number"
    onChange={(e) => {
        console.log("onChange: e.target.value (string):", e.target.value);
        handleInput('days', e.target.value);
    }}
/>
                    </div>

                    <div>
                        <h2 className="text-xl my-3 font-medium"> What is Your Budget? </h2>
                        <div className="grid grid-cols-3 gap-5 mt-5 ">
                            {SelectBudgetOptions.map((item, index) => (
                                <div
                                    key={index}
                                    className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formData?.budget === item.title && 'shadow-lg border-black'}`}
                                    onClick={(e) => {
                                        handleInput('budget', item.title);
                                    }}
                                >
                                    <h2 className="text-4xl">{item.icon}</h2>
                                    <h2 className="font-bold text-lg">{item.title}</h2>
                                    <h2 className="text-sm text-gray-500">{item.desc}</h2>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className='text-xl my-3 font-medium'>Whd do you plan on travelling with on your next adventure?</h2>
                            <div className='grid grid-cols-3 gap-5 mt-5 mb-5'>
                                {SelectTravelList.map((item, index) => (
                                    <div key={index} className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formData?.people === item.people && 'shadow-lg border-black'}`}
                                        onClick={(e) => {
                                            handleInput('people', item.people);
                                        }}>
                                        <h2 className='text-4xl'>{item.icon}</h2>
                                        <h2 className='font-bold text-lg'>{item.title}</h2>
                                        <h2 className='text-sm text-gray-500'>{item.desc}</h2>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className='my-10 justify-end flex'>
                        <Button onClick={onGenerateTrip} className=''> Generate Trip </Button>
                    </div>

                </div>
                <FullScreenLoader isLoading={isGenPrompt} />

                {/* {isGenPrompt && (
                    <div className="flex items-center justify-center mt-4">
                        <Loader className="size-8 animate-spin" />
                    </div>
                )} */}
            </div>
        </div>
    );
}

export default CreateTrip;
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { AI_PROMPT, SelectBudgetOptions, SelectTravelList } from "@/constants/options";
// import { chatSession } from "@/service/AIModal";
// import { React, useEffect, useState } from "react";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";
// import {toast} from 'react-hot-toast'
// import { useGeminiStore } from "@/store/Gemini";
// function CreateTrip() {

//    const {handleGenerate,isGenPrompt } = useGeminiStore()

//   const [place, setPlace] = useState();
  
//   const [formData,setFormData] = useState({})

//   const handleInput = (name,value) =>{
     
//      setFormData((prevformData)=>({
//       ...prevformData,
//       [name]:value,
//      }));
//   }
  
//   useEffect(() => {
//     console.log(formData)
//   }, [formData])
  
//   const onGenerateTrip=async ()=>{
//     if( !formData?.days || !formData.location || !formData?.budget || !formData?.people){    
//       toast.error('Please Enter all required fields.')
//       return
//     }
//     if(formData?.days>10){
//       toast.error('Trip duration cannot exceed 10 days.')
//       return
//     }
     
//     const FINAL_PROMPT = AI_PROMPT
//     .replace('{location}',formData?.location.label)
//     .replace('{days}',formData?.days)
//     .replace('{people}',formData?.people)
//     .replace('{budget}',formData?.budget)
//     .replace('{total_days}',formData?.days)

//     console.log(FINAL_PROMPT);

//     //this i have to modify for backend gemini api call
//     const result =await handleGenerate.sendMessage(FINAL_PROMPT);
//     if(isGenPrompt){
//       //use Loader from lucide react and add a pleasing loading cursor bw generation  time of reply from gemini 
//       //dont change the page just add loader (most aesthetic available there)
//     }
//     console.log(result?.response?.text())

//   }

//   return (
//     <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
//       <h2 className="font-bold text-3xl"> Tell us your travel preferences🌍 </h2>
//       <p className="mt-3  text-gray-500">
//         Just provide some basic information, and our trip planner will generate
//         a customized itinerary based on your preferences.
//       </p>

//       <div className="mt-10 flex flex-col gap-9">
//         <div>
//           <h2 className="text-xl my-3 font-medium">
//             What is the destination of choice?
//           </h2>
//           <GooglePlacesAutocomplete
//             apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
//             selectProps={{
//               place,
//               onChange: (v) => {
//                 setPlace(v);
//                 handleInput('location',v)
//               },
//             }}
//           />
//           <div>
//             <h2 className="text-xl my-3 font-medium">
//               {" "}
//               How many days are you planning for trip?
//             </h2>
//             <Input placeholder={"Ex.3"} type="number" 
//             onChange={(e)=>{
//               handleInput('days',e.target.value)
//             }}/>
//           </div>

//           <div>
//             <h2 className="text-xl my-3 font-medium"> What is Your Budget? </h2>
//             <div className="grid grid-cols-3 gap-5 mt-5 ">
//               {SelectBudgetOptions.map((item, index) => (
//                 <div
//                   key={index}
//                   className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formData?.budget==item.title && 'shadow-lg border-black'}`} //conditional  tailwind css
//                   onClick={(e)=>{
//                     handleInput('budget',item.title)
//                   }}
//                 >
//                   <h2 className="text-4xl">{item.icon}</h2>
//                   <h2 className="font-bold text-lg">{item.title}</h2>
//                   <h2 className="text-sm text-gray-500">{item.desc}</h2>
//                 </div>
//               ))}
//             </div>

//             <div>
//             <h2 className='text-xl my-3 font-medium'>Whd do you plan on travelling with on your next adventure?</h2>
//          <div className='grid grid-cols-3 gap-5 mt-5 mb-5'>
//           {SelectTravelList.map((item,index)=>(
//              <div key={index} className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer ${formData?.people==item.people && 'shadow-lg border-black'}`} //conditional  tailwind css
//              onClick={(e)=>{
//               handleInput('people',item.people)
//             }}>
//                  <h2 className='text-4xl'>{item.icon}</h2>
//                 <h2 className='font-bold text-lg'>{item.title}</h2>
//                 <h2 className='text-sm text-gray-500'>{item.desc}</h2>
//              </div>
//           )
//           )}
//             </div>
//           </div>
//           </div>
//           <div className='my-10 justify-end flex'>
//           <Button  onClick={onGenerateTrip} className=''> Generate Trip  </Button>
//           </div>
          
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CreateTrip;
