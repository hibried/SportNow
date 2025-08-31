import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

function SportActivities() {
    const [activities, setActivities] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // form modal
    const [formTitle, setFormTitle] = useState("");
    const [id, setId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    //

    // FOR FILTERS
    const [categories, setCategories] = useState([]);
    const [provinceId, setProvinceId] = useState(-1); // if -1, all cities
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [search, setSearch] = useState("");

    async function getCategories(){
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-categories?is_paginate=false`);
            // console.log(response.data.result);
            setCategories(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    async function getProvinces(){
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/location/provinces?is_paginate=false`);
            // console.log(response.data.result);
            setProvinces(response.data.result);
        } catch (error) { 
            console.error(error);
        }
    }

    async function getCities(id){
        const province_id = (id === -1) ? "" : `/${id}`;
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/location/cities${province_id}?is_paginate=false`);
            // console.log(response.data.result);
            setCities(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }
    
    useEffect(() => {
        getCategories();
        getProvinces();
        getCities(11);
    }, []);

    //

    async function getActivities(pageNum) {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-activities?page=${pageNum}`);
            setActivities(response.data.result.data);
            setPage(response.data.result.current_page);
            setTotalPages(response.data.result.last_page);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getActivities(page);
    }, [page])

    const goToNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const goToPreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const openDeleteModal = () => {
        document.getElementById("delete_modal").showModal();
    };

    async function handleDelete() {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.delete(`${BASE_URL}/api/v1/sport-activities/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log(response);
            getActivities(page);
            document.getElementById("delete_modal").close();
        } catch (error) {
            console.error(error.response.data.message);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    const navigate = useNavigate();

    return (
        <div className="p-3 pt-5 sm:p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-3 sm:mb-6">
                {/* Title */}
                <h1 className="text-2xl sm:text-[32px] font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 text-transparent bg-clip-text dark:text-base-content">
                    SPORT ACTIVITIES
                </h1>

                {/* Pagination */}
                <div className="join">
                    <button
                        onClick={goToPreviousPage}
                        disabled={page === 1}
                        className="join-item btn btn-outline btn-sm sm:btn-md hover:from-indigo-600 hover:to-cyan-500 bg-gradient-to-r"
                    >
                        «
                    </button>
                    <button className="hidden sm:block join-item btn btn-primary btn-sm sm:btn-md">
                        {page}
                    </button>
                    <button
                        onClick={goToNextPage}
                        disabled={page === totalPages}
                        className="join-item btn btn-outline btn-sm sm:btn-md hover:from-indigo-600 hover:to-cyan-500 bg-gradient-to-r"
                    >
                        »
                    </button>
                </div>

                {/* Add Button */}
                <button
                    className="btn btn-primary btn-sm sm:btn-md rounded-lg shadow-md hover:shadow-xl transition-all"
                    onClick={() => navigate("/sport_activities/add")}
                >
                    +
                </button>
            </div>

            {/* Table Container */}
            <div
                className="w-full rounded-tr-4xl rounded-bl-4xl shadow-xl border-4 border-transparent bg-base-100 overflow-x-auto max-h-190"
                style={{
                    background: "linear-gradient(90deg, #4f46e5, #06b6d4) border-box",
                }}
            >
                <table className="table table-zebra w-full">
                    {/* Table Header */}
                    <thead className="text-white sticky top-0 z-10"
                            style={{
                            background: "linear-gradient(90deg, #4f46e5, #06b6d4) border-box",
                        }}
                    >
                        <tr>
                            <th>ID</th>
                            <th>CATEGORY</th>
                            <th>CITY</th>
                            <th>TITLE</th>
                            <th>SLOTS</th>
                            <th>PRICE</th>
                            <th>ADDRESS</th>
                            <th>ACTIVITY DATE</th>
                            <th>TIME</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-base-100 dark:bg-base-300 relative overflow-y-auto">
                        {activities.map((a, index) => (
                            <tr
                                key={index}
                                className="hover:bg-base-200 transition-all duration-200"
                            >
                                <th>{a.id}</th>
                                <td>{a.sport_category === null ? "-" : a.sport_category.name}</td>
                                <td className="text-nowrap">{a.city.city_name_full}</td>
                                <td className="font-medium text-nowrap">{a.title}</td>
                                <td>{a.participants.length} / {a.slot}</td>
                                <td>Rp{a.price.toLocaleString('de-DE')}</td>
                                <td className="max-w-50 truncate">{a.address}</td>
                                <td>{a.activity_date}</td>
                                <td className="text-nowrap">{a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}</td>
                                <td className="flex gap-3">
                                    {/* Edit */}
                                    <button
                                        onClick={() => navigate(`/sport_activities/edit/${a.id}`)}
                                        className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition cursor-pointer"
                                    >
                                        <Edit className="w-5 h-5 text-indigo-600" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => {
                                            openDeleteModal();
                                            setFormTitle(`Delete Activity: ${a.title} (ID_${a.id})`);
                                            setId(a.id);
                                        }}
                                        className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900 transition cursor-pointer"
                                    >
                                        <Trash2 className="w-5 h-5 text-red-500" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* DELETE MODAL */}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">{formTitle}</h3>
                    <p className="py-4">This action cannot be undone. Are you sure?</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn" disabled={isLoading}>No</button>
                        </form>
                        <button onClick={handleDelete} className={`btn btn-error ${isLoading ? "loading" : ""}`}>Yes</button>
                    </div>
                </div>
            </dialog>

        </div>
    )
}

export { SportActivities }