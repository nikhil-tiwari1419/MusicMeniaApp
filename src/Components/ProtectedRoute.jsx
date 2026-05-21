import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/useAuth";
import Pageloder from "./Pageloder";

function ProtectedRoute({ children, allowedRole }) {
    const { user, loading, logout } = useAuth();

    if(loading) return <Pageloder/>

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRole && (user.role || user.role !== allowedRole)){
        return <Navigate to="/unauthorized"/>;
    }

    return children;
}


export default ProtectedRoute;

