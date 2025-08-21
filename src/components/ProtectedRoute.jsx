import { Outlet, Navigate } from "react-router-dom";

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
            return <>{ children || <Outlet /> }</>;
        }
    }
};

export default ProtectedRoute;