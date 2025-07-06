import { useEffect } from 'react';
import HomePage from './components/HomePage.jsx';
import { Toaster } from 'react-hot-toast';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import LoginPage from './components/LoginPage.jsx';
import SignupPage from './components/SignupPage.jsx';
import Header from './components/Header';
import { useAuthStore } from './store/useAuthStore';
import CreateTrip from './create-trip/index.jsx';
import Viewtrip from './view-trip/tripId/index.jsx';
import ProtectedRoute from './components/Protect.jsx';
import Mytrips from './my-trips/Index.jsx';
function App() {
    const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const showHeader = location.pathname !== '/signup' && location.pathname !== '/login';

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    if (isCheckingAuth && !authUser) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Toaster />
            {showHeader && <Header />}
            <Routes>
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                
                <Route
                    path="/create-trip"
                    element={
                            <CreateTrip />
                       
                    }
                />
                <Route
                    path="/view-trip/:tripid"
                    element={
                        <ProtectedRoute>
                            <Viewtrip />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/my-trips"
                    element={
                        <ProtectedRoute>
                            <Mytrips />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}

export default App;
// import { useEffect } from 'react';
// import HomePage from './components/HomePage.jsx';
// import { Toaster } from 'react-hot-toast';
// import { Routes, Route, Navigate, useLocation,useNavigate } from 'react-router-dom';
// import { Home, Loader } from 'lucide-react';
// import LoginPage from './components/LoginPage.jsx';
// import SignupPage from './components/SignupPage.jsx';
// import Header from './components/Header';
// import { useAuthStore } from './store/useAuthStore';
// import CreateTrip from './create-trip/index.jsx';
// import Viewtrip from './view-trip/tripId/index.jsx';

// function App() {
//     const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
//     const location = useLocation();
//     const navigate = useNavigate();
//     const showHeader = location.pathname !== '/signup' && location.pathname !== '/login';

//     useEffect(() => {
//         checkAuth();
//     }, [checkAuth]);
   
//     useEffect(() => {
//       if (!authUser && location.pathname !== '/' && location.pathname !== '/create-trip' && location.pathname !== '/login' && location.pathname !== '/signup') {
//           navigate('/');
//       }
//   }, [authUser, navigate, location.pathname]);

//     if (isCheckingAuth && !authUser) {
//         return (
//             <div className="flex items-center justify-center h-screen">
//                 <Loader className="size-10 animate-spin" />
//             </div>
//         );
//     }

//     return (
//         <>
//             <Toaster />
//             {showHeader && <Header />}
//             <Routes>
//                 <Route path="/signup" element={ <SignupPage />} />
//                 <Route path="/login" element={<LoginPage />}/>
//                 <Route path="/" element={<HomePage/>} />
//                 <Route path="/create-trip" element={<CreateTrip/>} />
//                 <Route path="/view-trip/:tripid" element={<Viewtrip/>} />
//             </Routes>
//         </>
//     );
// }

// export default App;


