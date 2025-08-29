import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Logout } from "./Logout"

function Navbar() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("accessToken"));

    // Listen for token changes (like after login/logout)
    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem("accessToken"));
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    return (
        <div className="navbar bg-base-100 shadow-sm max-w-5xl mx-auto px-2">
            <div className="flex-1">
                <button className="btn btn-ghost text-xl" onClick={() => navigate("/")}>
                    SportNow
                </button>
            </div>
            <div className="flex-none">
                {token ? (
                    <button className="btn" onClick={() => { Logout(navigate); setToken(null); }}>
                        Logout
                    </button>
                ) : (
                    <button className="btn" onClick={() => navigate("/login")}>
                        Login
                    </button>
                )}
            </div>
        </div>
    )
}

export default Navbar;
