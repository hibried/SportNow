import { useState, useEffect } from "react";
import { Edit, Trash2 } from "lucide-react";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

function Categories() {
    const [categories, setCategories] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // form modal
    const [formTitle, setFormTitle] = useState("");
    const [id, setId] = useState("");
    const [name, setName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    //

    async function getCategories(pageNum) {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-categories?page=${pageNum}`);
            setCategories(response.data.result.data);
            setPage(response.data.result.current_page);
            setTotalPages(response.data.result.last_page);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getCategories(page);
    }, [page])

    const goToNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const goToPreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const openFormModal = () => {
        document.getElementById("form_modal").showModal();
    };

    const openDeleteModal = () => {
        document.getElementById("delete_modal").showModal();
    };

    async function handleSubmit() {
        const method = (id === "") ? "create" : `update/${id}`;
        setIsLoading(true);
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/sport-categories/${method}`, {
                name: name
            }, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
            });
            console.log(response);
            getCategories(page);
            document.getElementById("form_modal").close();
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleDelete() {
        setIsLoading(true);
        try {
            const response = await axios.delete(`${BASE_URL}/api/v1/sport-categories/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                },
            });
            console.log(response);
            getCategories(page);
            document.getElementById("delete_modal").close();
        } catch (error) {
            console.error(error.response.data.message);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-3 pt-5 sm:p-8">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
                {/* Title */}
                <h1 className="text-2xl sm:text-[32px] font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 text-transparent bg-clip-text dark:text-white">
                    CATEGORIES
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

                {/* Add Category */}
                <button
                    className="btn btn-primary btn-sm sm:btn-md rounded-lg shadow-md hover:shadow-xl transition-all"
                    onClick={() => {
                        openFormModal();
                        setId("");
                        setFormTitle("Create Category");
                        setName("");
                    }}
                >
                    +
                </button>
            </div>

            {/* Table Container */}
            <div
                className="w-full rounded-tr-4xl rounded-bl-4xl shadow-xl border-4 border-transparent bg-base-100 overflow-x-auto max-h-190"
                style={{
                    background:
                    "linear-gradient(90deg, #4f46e5, #06b6d4) border-box",
                }}
            >
                <table className="table table-zebra w-full">
                    {/* Table Header */}
                    <thead className="text-white sticky top-0 z-10"
                        style={{
                            background:
                            "linear-gradient(90deg, #4f46e5, #06b6d4) border-box",
                        }}
                    >
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody className="bg-base-300 relative">
                        {categories.map((c, index) => (
                            <tr
                                key={index}
                                className="hover:bg-base-200 transition-all duration-200"
                            >
                                <th>{c.id}</th>
                                <td className="text-nowrap">{c.name}</td>
                                <td className="flex gap-3">
                                    {/* Edit */}
                                    <button
                                        onClick={() => {
                                            openFormModal();
                                            setFormTitle(`Update Category: ID_${c.id}`);
                                            setId(c.id);
                                            setName(c.name);
                                        }}
                                        className="p-2 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900 transition cursor-pointer"
                                    >
                                        <Edit className="w-5 h-5 text-indigo-600" />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => {
                                            openDeleteModal();
                                            setFormTitle(`Delete Category: ${c.name} (ID_${c.id})`);
                                            setId(c.id);
                                            setName("");
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

            {/* FORM MODAL */}
            <dialog id="form_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg mb-3">{formTitle}</h3>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Name</legend>
                        <input type="text" onChange={(e) => setName(e.target.value)} className="input w-full" value={name} />
                    </fieldset>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn" disabled={isLoading}>Cancel</button>
                        </form>
                        <button onClick={handleSubmit} className={`btn btn-primary ${isLoading ? "loading" : ""}`} disabled={name === "" ? true : false}>Submit</button>
                    </div>
                </div>
            </dialog>

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

export { Categories }