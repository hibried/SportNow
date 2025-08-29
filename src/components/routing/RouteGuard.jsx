import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../public/Navbar";
import AdminNavbar from "../admin/AdminNavbar";

const RouteGuard = ({ children, type = "public", allowedRoles = [] }) => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");

    // ----- Guest-only pages -----
    if (type === "guest") {
        if (token) return <Navigate to="/" replace />;
        return (
            <>
                <Navbar />
                { children || <Outlet /> }
            </>
        );
    }

    // ----- Public pages -----
    if (type === "public") {
        if (role === "admin") return <Navigate to="/dashboard" replace />;
        if (!token || !role) {
            localStorage.clear();
        }
        return (
            <>
                <Navbar />
                { children || <Outlet /> }
            </>
        );
    }

    // ----- Protected pages -----
    if (type === "protected") {
        if (!token || !role) {
            localStorage.clear();
            return <Navigate to="/login" replace />;
        }

        if (!allowedRoles.includes(role)) {
            if (role === "user") return <Navigate to="/" replace />;
            return <Navigate to="/dashboard" replace />;
        }

        if (role === "admin") {
            return <AdminNavbar Component={ children || <Outlet /> } />;
        }

        // any non-admin role (e.g. user)
        return (
            <>
                <Navbar />
                { children || <Outlet /> }
            </>
        );
    }

    // ----- Fallback -----
    return (
        <>
            <Navbar />
            { children || <Outlet /> }
        </>
    );
};

export default RouteGuard;
