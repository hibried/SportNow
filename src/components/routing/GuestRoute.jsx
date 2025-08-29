import Navbar from "../public/Navbar";
import { Navigate, Outlet } from "react-router-dom";

const GuestRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
        return <Navigate to="/" replace />;
    }

    return <>
        <Navbar />
        { children || <Outlet /> }
    </>
};

export default GuestRoute;