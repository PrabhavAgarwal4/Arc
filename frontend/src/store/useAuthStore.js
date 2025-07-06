import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isCheckingAuth: true,

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            console.log(data);
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data });
            toast.success("Account created successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isSigningUp: false });
        }
    },

    login: async (data) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({ authUser: res.data });
            toast.success("Logged in successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isLoggingIn: false });
        }
    },

    checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
            const res = await axiosInstance.get("/auth/check");
            set({ authUser: res.data });
        } catch (error) {
            console.log("Error in checkAuth:", error.response.data.message);
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
}));

// Create a custom hook to use navigate outside of the store. which will be dedicated to logouts 
export const useAuthNavigation = () => {
    const navigate = useNavigate();
    const logout = useAuthStore((state) => state.logout);

    const handleLogout = async () => {
        await logout();
        navigate('/'); // Navigate to homepage after logout
    };

    return { handleLogout };
};
//Dedicated to my trips button . This custom hook used to use navigate indirectly
export const useTripsNavigation = () => {
  const navigate = useNavigate();

  const handleTripsNavigation = () => {
      navigate('/my-trips');
  };

  return { handleTripsNavigation };
};

export const noAuthUserNavigation = () =>{
  const navigate = useNavigate();

  const handleHomeNavigation = () => {
      navigate('/');
  };

  return { handleHomeNavigation };
};
export const useCreateTripNavigation = ()=>{
  const navigate = useNavigate();

  const handleCreateTripNavigation = () => {
    navigate('/create-trip');
};

return { handleCreateTripNavigation };
}

