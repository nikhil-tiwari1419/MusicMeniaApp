import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/Auth";
import Pageloder from "./Pageloder";

function ProtectedRoute({ children, allowedRole }) {
    const { user, loading } = useAuth();

    if(loading) return <Pageloder/>

    if (!user) return <Navigate to="/" />;

    if (allowedRole && user.role !== allowedRole){
        return <Navigate to="/unauthorized"/>;
    }

    return children;
}


export default ProtectedRoute;

