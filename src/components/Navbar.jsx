import { useNavigate } from "react-router-dom"

function Navbar(){
    const navigate = useNavigate();

    return (
        <div className="navbar bg-base-100 shadow-sm max-w-5xl mx-auto px-2">
            <div className="flex-1">
                <button className="btn btn-ghost text-xl" onClick={() => navigate("/landing")}>SportNow</button>
            </div>
            <div className="flex-none">
                <button className="btn" onClick={() => navigate("/login")}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default Navbar