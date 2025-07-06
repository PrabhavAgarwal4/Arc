// ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore'; // Adjust path as needed

function ProtectedRoute({ children }) {
    const { authUser } = useAuthStore();

    if (!authUser) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;