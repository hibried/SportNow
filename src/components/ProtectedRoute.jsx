import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import AdminNavbar from "./admin/AdminNavbar";

const ProtectedRoute = ({ Logout, children, allowedRoles }) => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    if (!token || !role) {
        Logout();
    } else {
        if(!allowedRoles.includes(role)){
            if(role === "user"){
                return <Navigate to="/activity" />;
            } else {
                return <Navigate to="/dashboard" />;
            }
        } else {
            if(role === "user"){
                return <>
                    <Navbar />
                    { children || <Outlet /> }
                </>;
            } else {
                return <>
                     <AdminNavbar Logout={ Logout } Component={ children || <Outlet /> } />
                </>;
            }
        }
    }
};

export default ProtectedRoute;