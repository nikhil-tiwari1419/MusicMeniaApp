import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <p className="text-blue-400 foont-semibold animate-pulse">Loading...</p>
        </div>
    );

    if (!user) return <Navigate to="/login" />;

    return children;
}

export default ProtectedRoute;

