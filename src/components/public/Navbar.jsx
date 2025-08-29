import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

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
						{/* <li>
							<a href="#venues">Venues</a>
						</li> */}
						<li>
							<a href="#features">Why SportNow</a>
						</li>
						<li>
							<a href="#faq">FAQ</a>
						</li>
					</ul>
				</div>

				<div className="navbar-end gap-2">
					<a className="btn btn-ghost hidden md:inline-flex">Sign in</a>
					<a className="btn btn-primary">Sign up</a>
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
						<a href="#activities" onClick={() => setOpen(false)}>
							Activities
						</a>
					</li>
					<li>
						<a href="#venues" onClick={() => setOpen(false)}>
							Venues
						</a>
					</li>
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
					<li className="mt-3">
						<a className="btn btn-primary">Get Started</a>
					</li>
				</ul>
			</div>
		</>
	);
}

export default Navbar;