import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
import { BrowserRouter } from 'react-router-dom'
// import CreateTrip from "./create-trip/index.jsx"
// import Header from './components/custom/Header.jsx';
// import { Toaster } from 'react-hot-toast';
// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>
//   },
//   {
//     path:'/create-trip',
//     element:<CreateTrip/>
//   }
// ]);

 

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <div>
      <Toaster position="bottom-left"
  reverseOrder={true}
  />
    <Header/>
    < RouterProvider router={router}/>
    </div> */}
  <BrowserRouter>
    <App/>
    </BrowserRouter>

  </StrictMode>,
)
