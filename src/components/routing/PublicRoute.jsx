import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = ({ children }) => {
    const role = localStorage.getItem("role");

    if (role === "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <>
            {children || <Outlet />}
        </>
    );
};

export default PublicRoute;
