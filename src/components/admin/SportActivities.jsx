import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

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
        try {
            const response = await axios.delete(`${BASE_URL}/api/v1/sport-activities/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
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
            <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h1 className="text-2xl sm:text-[32px] font-semibold">Sport Activities</h1>
                <div className="join">
                    <button onClick={goToPreviousPage} disabled={page === 1} className="join-item btn btn-neutral rounded-l-lg btn-sm sm:btn-md">«</button>
                    <button className="hidden sm:block join-item btn btn-primary">{page}</button>
                    <button onClick={goToNextPage}  disabled={page === totalPages} className="join-item btn btn-neutral rounded-r-lg btn-sm sm:btn-md">»</button>
                </div>
                <button className="btn btn-primary text-[12px] sm:text-[14px] rounded-lg btn-sm sm:btn-md" onClick={() => navigate("/sport_activities/add")}>
                    +
                </button>
            </div>
            <div className="overflow-x-auto rounded-box border border-base-content/5 px-1 pb-1 bg-base-300">
                <table className="table rounded-box overflow-hidden">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>City</th>
                            <th>Title</th>
                            <th>Slots</th>
                            <th>Price</th>
                            <th>Address</th>
                            <th>Activity Date</th>
                            <th>Time</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-base-100">
                        {activities.map((a, index) => (
                            <tr key={index}>
                                <th>{a.id}</th>
                                <td>{a.sport_category === null ? "-" : a.sport_category.name}</td>
                                <td>{a.city.city_name_full}</td>
                                <td>{a.title}</td>
                                <td>{a.participants.length} / {a.slot}</td>
                                <td>Rp{a.price.toLocaleString('de-DE')}</td>
                                <td className="max-w-50 truncate">{a.address}</td>
                                <td>{a.activity_date}</td>
                                <td>{a.start_time} - {a.end_time}</td>
                                <td className="flex gap-2">
                                    <button onClick={() => navigate(`/sport_activities/edit/${a.id}`)}>
                                        <Edit className="w-5 h-5 text-blue-500 cursor-pointer" />
                                    </button>
                                    <button onClick={() => {
                                        openDeleteModal();
                                        setFormTitle(`Delete Activity: ${a.title} (ID_${a.id})`);
                                        setId(a.id);
                                    }}>
                                        <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
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