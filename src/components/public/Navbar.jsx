import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Logout } from "../../components/Logout";
import ThemeToggle from "../ThemeController";
import EditAccountModal from "./EditAccount";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

function Navbar() {
  	const [open, setOpen] = useState(false);
	const [bearerToken, setBearerToken] = useState("");
	const navigate = useNavigate();

	const [modalOpen, setModalOpen] = useState(false);

	const [myName, setMyName] = useState("");
	const getMe = async () => {
        const token = localStorage.getItem("accessToken");
		if(token){
			try {
				const response = await axios.get(`${BASE_URL}/api/v1/me`, {
					headers: {
						Authorization: `Bearer ${token}`,
						Accept: "application/json",
					},
				});
				setMyName(response.data.data.name);
			} catch (error) {
				console.error(error);
			}
		}
    }

	useEffect(() => {
		getMe();
		setBearerToken(localStorage.getItem("accessToken"));
	}, []);
	
  	return (
		<>
			<div className="navbar sticky top-0 z-50 bg-base-100/80 backdrop-blur border-b border-base-200">
				<div className="navbar-start">
					<button
						className="btn btn-ghost lg:hidden"
						aria-label="Open menu"
						onClick={() => setOpen(true)}
					>
						<Menu className="h-5 w-5" />
					</button>
					<button onClick={() => navigate("/")} className="btn btn-ghost text-2xl font-extrabold tracking-tight">
						SportNow
					</button>
				</div>

				<div className="navbar-center hidden lg:flex">
					<ul className="menu menu-horizontal gap-2 text-sm">
						<li>
							<button onClick={() => navigate("/activities")}>Activities</button>
						</li>
						{bearerToken && (
							<li>
								<button onClick={() => navigate("/my-transaction")}>My Transaction</button>
							</li>
						)}
						<li>
							<a href="#features">Why SportNow</a>
						</li>
						<li>
							<a href="#faq">FAQ</a>
						</li>
					</ul>
				</div>

				<div className="navbar-end gap-2">
					<ThemeToggle />
					{!bearerToken ? (
						<div>
							<button onClick={() => navigate("/login")} className="btn btn-ghost hidden md:inline-flex">Sign in</button>
							<button onClick={() => navigate("/register")} className="btn btn-primary">Sign up</button>
						</div>
					) : (
						<div className="dropdown dropdown-end">
                            <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar lg:tooltip lg:tooltip-left" data-tip={myName}>
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
									/>
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu dropdown-content bg-base-100/90 rounded-box z-1 mt-4 w-52 p-0 shadow-lg">
                                <li><a onClick={() => setModalOpen(true)} className="px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm"><img src="/home/account.png" alt="" /> Edit Account</a></li>
                                <li className="m-0"></li>
                                <li>
									<a
										onClick={async () => {
											await Logout(navigate)
											setBearerToken(null);
										}}
										className="px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm">
											<img src="/home/logout.png" className="mr-1" alt="" /> Log out
									</a>
								</li>
                            </ul>
                        </div>
					)}
					
				</div>
			</div>

			{/* Mobile Drawer */}
			<div
				className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
					open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
				}`}
				onClick={() => setOpen(false)}
			/>
			<div
				className={`fixed left-0 top-0 h-full w-80 bg-base-100 shadow-2xl p-4 transition-transform duration-300 z-[60] ${
				open ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<div className="flex items-center justify-between">
					<span className="text-xl font-bold">SportNow</span>
					<button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}>
						<X className="h-5 w-5" />
					</button>
				</div>

				<ul className="menu mt-6">
					<li>
						<a onClick={() => {
							setOpen(false);
							navigate("/activities");
						}}>
							Activities
						</a>
					</li>
					{bearerToken && (
						<li>
							<a onClick={() => {
								setOpen(false);
								navigate("/my-transaction");
							}}>
								My Transaction
							</a>
						</li>
					)}
					<li>
						<a href="#features" onClick={() => setOpen(false)}>
							Why SportNow
						</a>
					</li>
					<li>
						<a href="#faq" onClick={() => setOpen(false)}>
							FAQ
						</a>
					</li>
					{!bearerToken && 
						<li className="mt-3">
							<button onClick={() => navigate("/register")} className="btn btn-primary">Sign up</button>
						</li>
					}
				</ul>
			</div>
			<EditAccountModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
		</>
	);
}

export default Navbar;