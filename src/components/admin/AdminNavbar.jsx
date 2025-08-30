import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { Logout } from "../../components/Logout";
import { toast } from 'sonner';
import ThemeToggle from "../ThemeController";

function AdminNavbar({ Component }) {

    const [isOpen, setIsOpen] = useState(false);
    const [active, setActive] = useState(() => {
        return localStorage.getItem("adminNavTab") || "dashboard";
    });

    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem("adminNavTab", active);
    }, [active]);

    return (
        <div className={`drawer ${isOpen ? "drawer-open" : ""}`}>
            <input onChange={() => setIsOpen(!isOpen)} id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
                {/* Navbar */}
                <div className="navbar bg-base-300 w-full px-4 md:px-9 border-b-1 border-b-gray-300 sticky top-0 z-11">
                    <div className="navbar-start flex flex-none gap-7">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="cursor-pointer">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                        <label className="hidden md:flex input rounded-full">
                            <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <g
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    strokeWidth="2.5"
                                    fill="none"
                                    stroke="currentColor"
                                >
                                    <circle cx="11" cy="11" r="8"></circle>
                                    <path d="m21 21-4.3-4.3"></path>
                                </g>
                            </svg>
                            <input type="search" required placeholder="Search" />
                        </label>
                    </div>
                    <div className="navbar-end flex-none">
                        <button className="md:hidden btn btn-ghost btn-circle">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /> </svg>
                        </button>
                        <button className="btn btn-ghost btn-circle">
                            <div className="indicator">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /> </svg>
                                <span className="badge badge-xs badge-primary indicator-item"></span>
                            </div>
                        </button>
                        <ThemeToggle />
                        <div className="dropdown dropdown-end">
                            <div tabIndex="0" role="button" className="btn btn-ghost btn-circle avatar lg:tooltip lg:tooltip-left" data-tip="Eve Jolt">
                                <div className="w-10 rounded-full">
                                    <img
                                        alt="Tailwind CSS Navbar component"
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                            <ul tabIndex={0} className="menu dropdown-content bg-base-300 rounded-box z-1 mt-4 w-52 p-0 shadow-lg border border-gray-300 dark:border-white">
                                <li><a className="px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm"><img src="/home/account.png" alt="" /> Manage Account</a></li>
                                <li className="m-0"></li>
                                <li><a className="px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm"><img src="/home/key.png" className="mr-1" alt="" /> Change Password</a></li>
                                <li className="m-0"></li>
                                <li><a className="px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm"><img src="/home/reload.png" className="mr-1" alt="" /> Activity Log</a></li>
                                <li className="m-0"></li>
                                <li><a onClick={() => Logout(navigate)} className="px-3 py-2 sm:px-5 sm:py-3 text-xs sm:text-sm"><img src="/home/logout.png" className="mr-1" alt="" /> Log out</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                {/* Page content here */}
                <Component />
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar"></label>
                <ul className="menu bg-base-300 min-h-full lg:w-60 border-r-1 border-r-gray-300 p-0 pt-4">
                    {/* Sidebar content here */}
                    <li>
                        <button 
                            onClick={() => {
                                setActive("dashboard");
                                navigate("/dashboard");
                            }}
                            className={`gap-4 btn ${active === "dashboard" ? "btn-primary" : "btn-ghost"} justify-start text-start text-[14px] py-6 rounded-lg mx-2 lg:mx-4 hover:text-[##e0e7ff]`}
                        >
                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.15625 2.94922C4.78906 1.31641 6.73698 0.5 9 0.5C11.263 0.5 13.1966 1.31641 14.8008 2.94922C16.4336 4.55339 17.25 6.48698 17.25 8.75C17.25 11.013 16.4336 12.9609 14.8008 14.5938C13.1966 16.1979 11.263 17 9 17C6.73698 17 4.78906 16.1979 3.15625 14.5938C1.55208 12.9609 0.75 11.013 0.75 8.75C0.75 6.48698 1.55208 4.55339 3.15625 2.94922ZM13.8555 3.89453C12.5091 2.54818 10.8906 1.875 9 1.875C7.10938 1.875 5.49089 2.54818 4.14453 3.89453C2.79818 5.24089 2.125 6.85938 2.125 8.75C2.125 10.6406 2.79818 12.2591 4.14453 13.6055C5.49089 14.9518 7.10938 15.625 9 15.625C10.8906 15.625 12.5091 14.9518 13.8555 13.6055C15.2018 12.2591 15.875 10.6406 15.875 8.75C15.875 6.85938 15.2018 5.24089 13.8555 3.89453ZM8.48438 2.77734C8.6276 2.63411 8.79948 2.5625 9 2.5625C9.20052 2.5625 9.35807 2.63411 9.47266 2.77734C9.61589 2.89193 9.6875 3.04948 9.6875 3.25C9.6875 3.45052 9.61589 3.6224 9.47266 3.76562C9.35807 3.88021 9.20052 3.9375 9 3.9375C8.79948 3.9375 8.6276 3.88021 8.48438 3.76562C8.36979 3.6224 8.3125 3.45052 8.3125 3.25C8.3125 3.04948 8.36979 2.89193 8.48438 2.77734ZM4.61719 4.41016C4.76042 4.26693 4.91797 4.19531 5.08984 4.19531C5.29036 4.19531 5.46224 4.26693 5.60547 4.41016C5.7487 4.52474 5.82031 4.68229 5.82031 4.88281C5.82031 5.05469 5.7487 5.21224 5.60547 5.35547C5.46224 5.4987 5.29036 5.57031 5.08984 5.57031C4.91797 5.57031 4.76042 5.4987 4.61719 5.35547C4.5026 5.21224 4.44531 5.05469 4.44531 4.88281C4.44531 4.68229 4.5026 4.52474 4.61719 4.41016ZM12.3945 4.36719L13.3828 5.35547L10.332 8.40625C10.3607 8.52083 10.375 8.63542 10.375 8.75C10.375 9.1224 10.2318 9.45182 9.94531 9.73828C9.6875 9.99609 9.3724 10.125 9 10.125C8.6276 10.125 8.29818 9.99609 8.01172 9.73828C7.75391 9.45182 7.625 9.1224 7.625 8.75C7.625 8.3776 7.75391 8.0625 8.01172 7.80469C8.29818 7.51823 8.6276 7.375 9 7.375C9.11458 7.375 9.22917 7.38932 9.34375 7.41797L12.3945 4.36719ZM2.98438 8.27734C3.1276 8.13411 3.29948 8.0625 3.5 8.0625C3.70052 8.0625 3.85807 8.13411 3.97266 8.27734C4.11589 8.39193 4.1875 8.54948 4.1875 8.75C4.1875 8.95052 4.11589 9.1224 3.97266 9.26562C3.85807 9.38021 3.70052 9.4375 3.5 9.4375C3.29948 9.4375 3.1276 9.38021 2.98438 9.26562C2.86979 9.1224 2.8125 8.95052 2.8125 8.75C2.8125 8.54948 2.86979 8.39193 2.98438 8.27734ZM13.9844 8.27734C14.1276 8.13411 14.2995 8.0625 14.5 8.0625C14.7005 8.0625 14.8581 8.13411 14.9727 8.27734C15.1159 8.39193 15.1875 8.54948 15.1875 8.75C15.1875 8.95052 15.1159 9.1224 14.9727 9.26562C14.8581 9.38021 14.7005 9.4375 14.5 9.4375C14.2995 9.4375 14.1276 9.38021 13.9844 9.26562C13.8698 9.1224 13.8125 8.95052 13.8125 8.75C13.8125 8.54948 13.8698 8.39193 13.9844 8.27734ZM4.61719 12.1445C4.76042 12.0013 4.91797 11.9297 5.08984 11.9297C5.29036 11.9297 5.46224 12.0013 5.60547 12.1445C5.7487 12.2878 5.82031 12.4596 5.82031 12.6602C5.82031 12.832 5.7487 12.9896 5.60547 13.1328C5.46224 13.2474 5.29036 13.3047 5.08984 13.3047C4.91797 13.3047 4.76042 13.2474 4.61719 13.1328C4.5026 12.9896 4.44531 12.832 4.44531 12.6602C4.44531 12.4596 4.5026 12.2878 4.61719 12.1445ZM12.3945 12.1445C12.5378 12.0013 12.6953 11.9297 12.8672 11.9297C13.0677 11.9297 13.2253 12.0013 13.3398 12.1445C13.4831 12.2878 13.5547 12.4596 13.5547 12.6602C13.5547 12.832 13.4831 12.9896 13.3398 13.1328C13.2253 13.2474 13.0677 13.3047 12.8672 13.3047C12.6953 13.3047 12.5378 13.2474 12.3945 13.1328C12.2513 12.9896 12.1797 12.832 12.1797 12.6602C12.1797 12.4596 12.2513 12.2878 12.3945 12.1445Z" fill="currentColor"/>
                            </svg>
                            <span className="hidden lg:block">Dashboard</span>
                        </button>
                    </li>
                    <li className="m-0 my-3"></li>
                    <li className="hidden lg:block text-[12px] font-bold opacity-[0.6] px-8 mb-3">MANAGEMENTS</li>
                    <li>
                        <button 
                            onClick={() => {
                                setActive("categories");
                                navigate("/categories");
                            }} 
                            className={`gap-4 btn ${active === "categories" ? "btn-primary" : "btn-ghost"} justify-start text-start text-[14px] py-6 rounded-lg mx-2 lg:mx-4 hover:text-[##e0e7ff]`}
                        >
                            <svg width="18" height="17" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.4375 0.1875H1.125H14.875H15.5625V0.875V14.625V15.3125H14.875H1.125H0.4375V14.625V0.875V0.1875ZM1.8125 1.5625V7.0625H7.3125V1.5625H1.8125ZM8.6875 1.5625V7.0625H14.1875V1.5625H8.6875ZM1.8125 8.4375V13.9375H7.3125V8.4375H1.8125ZM8.6875 8.4375V13.9375H14.1875V8.4375H8.6875Z" fill="currentColor"/>
                            </svg>
                            <span className="hidden lg:block">Categories</span>
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => {
                                setActive("transactions");
                                navigate("/transactions");
                            }}
                            className={`gap-4 btn ${active === "transactions" ? "btn-primary" : "btn-ghost"} justify-start text-start text-[14px] py-6 rounded-lg mx-2 lg:mx-4 hover:text-[##e0e7ff]`}
                        >
                            <svg width="18" height="17" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.207 0.015625L18.7227 2.9375H17.3047L17.0898 1.60547L9.3125 2.9375H1.14844L18.207 0.015625ZM0.375 3.625H1.0625H2.09375H18.9375H19.625V4.3125V13.9375V14.625H18.9375H1.0625H0.375V13.9375V5.34375V4.3125V3.625ZM3.76953 5C3.79818 5.14323 3.8125 5.25781 3.8125 5.34375C3.8125 5.83073 3.64062 6.24609 3.29688 6.58984C2.98177 6.90495 2.58073 7.0625 2.09375 7.0625C2.00781 7.0625 1.89323 7.04818 1.75 7.01953V11.2305C1.89323 11.2018 2.00781 11.1875 2.09375 11.1875C2.58073 11.1875 2.98177 11.3594 3.29688 11.7031C3.64062 12.0182 3.8125 12.4193 3.8125 12.9062C3.8125 12.9922 3.79818 13.1068 3.76953 13.25H16.2305C16.2018 13.1068 16.1875 12.9922 16.1875 12.9062C16.1875 12.4193 16.3451 12.0182 16.6602 11.7031C17.0039 11.3594 17.4193 11.1875 17.9062 11.1875C17.9922 11.1875 18.1068 11.2018 18.25 11.2305V7.01953C18.1068 7.04818 17.9922 7.0625 17.9062 7.0625C17.4193 7.0625 17.0039 6.90495 16.6602 6.58984C16.3451 6.24609 16.1875 5.83073 16.1875 5.34375C16.1875 5.25781 16.2018 5.14323 16.2305 5H3.76953ZM7.55078 6.71875C8.23828 6.03125 9.05469 5.6875 10 5.6875C10.9453 5.6875 11.7474 6.03125 12.4062 6.71875C13.0938 7.3776 13.4375 8.17969 13.4375 9.125C13.4375 10.0703 13.0938 10.8867 12.4062 11.5742C11.7474 12.2331 10.9453 12.5625 10 12.5625C9.05469 12.5625 8.23828 12.2331 7.55078 11.5742C6.89193 10.8867 6.5625 10.0703 6.5625 9.125C6.5625 8.17969 6.89193 7.3776 7.55078 6.71875ZM11.4609 7.66406C11.0599 7.26302 10.5729 7.0625 10 7.0625C9.42708 7.0625 8.9401 7.26302 8.53906 7.66406C8.13802 8.0651 7.9375 8.55208 7.9375 9.125C7.9375 9.69792 8.13802 10.1849 8.53906 10.5859C8.9401 10.987 9.42708 11.1875 10 11.1875C10.5729 11.1875 11.0599 10.987 11.4609 10.5859C11.862 10.1849 12.0625 9.69792 12.0625 9.125C12.0625 8.55208 11.862 8.0651 11.4609 7.66406Z" fill="currentColor"/>
                            </svg>
                            <span className="hidden lg:block">Transactions</span>
                        </button>
                    </li>
                    <li>
                        <button 
                            onClick={() => {
                                setActive("sport_activities");
                                navigate("/sport_activities");
                            }} 
                            className={`gap-4 btn ${active === "sport_activities" ? "btn-primary" : "btn-ghost"} justify-start text-start text-[14px] py-6 rounded-lg mx-2 lg:mx-4 hover:text-[##e0e7ff]`}
                        >
                            <svg width="18" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0.4375 0.5H1.125H13.5H14.1875V1.1875V16.3125V17H13.5H1.125H0.4375V16.3125V1.1875V0.5ZM1.8125 1.875V5.3125H12.8125V1.875H1.8125ZM1.8125 6.6875V10.8125H12.8125V6.6875H1.8125ZM1.8125 12.1875V15.625H12.8125V12.1875H1.8125Z" fill="currentColor"/>
                            </svg>
                            <span className="hidden lg:block">Sport Activities</span>
                        </button>
                    </li>
                    <li className="m-0 my-3"></li>
                    <li>
                        <button 
                            onClick={() => Logout(navigate)} 
                            className="gap-4 btn dark:btn-soft btn-error justify-start text-start text-[14px] py-6 rounded-lg mx-2 lg:mx-4 hover:text-[##e0e7ff]"
                        >
                            <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.3125 0.5H9.6875V8.75H8.3125V0.5ZM6.25 0.972656V2.47656C5.01823 2.99219 4.01562 3.82292 3.24219 4.96875C2.4974 6.11458 2.125 7.375 2.125 8.75C2.125 10.6406 2.79818 12.2591 4.14453 13.6055C5.49089 14.9518 7.10938 15.625 9 15.625C10.8906 15.625 12.5091 14.9518 13.8555 13.6055C15.2018 12.2591 15.875 10.6406 15.875 8.75C15.875 7.375 15.4883 6.11458 14.7148 4.96875C13.9701 3.82292 12.9818 2.99219 11.75 2.47656V0.972656C13.3828 1.54557 14.7005 2.54818 15.7031 3.98047C16.7344 5.38411 17.25 6.97396 17.25 8.75C17.25 11.013 16.4336 12.9609 14.8008 14.5938C13.1966 16.1979 11.263 17 9 17C6.73698 17 4.78906 16.1979 3.15625 14.5938C1.55208 12.9609 0.75 11.013 0.75 8.75C0.75 6.97396 1.2513 5.38411 2.25391 3.98047C3.28516 2.54818 4.61719 1.54557 6.25 0.972656Z" fill="currentColor"/>
                            </svg>
                            <span className="hidden lg:block">Logout</span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default AdminNavbar