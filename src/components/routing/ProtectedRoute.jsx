import { Outlet, Navigate } from "react-router-dom";
import AdminNavbar from "../admin/AdminNavbar";
import Navbar from "../public/Navbar";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!token || !role) {
        localStorage.clear();
        return <Navigate to="/login" replace />;
    }

    if(!allowedRoles.includes(role)){
        if(role === "user"){
            return <Navigate to="/" replace />;
        } else {
            return <Navigate to="/dashboard" replace />;
        }
    }

    if(role === "user"){
        return <>
            <Navbar />
            { children || <Outlet /> }
        </>;
    } else {
        return <>
            <AdminNavbar Component={ children || <Outlet /> } />
        </>;
    }
        
};

export default ProtectedRoute;