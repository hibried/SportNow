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
    const [id, setId] = useState(0);
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
        const method = (id === 0) ? "create" : `update/${id}`;
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
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="p-3 pt-5 sm:p-8">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h1 className="text-2xl sm:text-[32px] font-semibold">Categories</h1>
                <div className="join">
                    <button onClick={goToPreviousPage} disabled={page === 1} className="join-item btn btn-neutral rounded-l-lg btn-sm sm:btn-md">«</button>
                    <button className="hidden sm:block join-item btn btn-primary">{page}</button>
                    <button onClick={goToNextPage}  disabled={page === totalPages} className="join-item btn btn-neutral rounded-r-lg btn-sm sm:btn-md">»</button>
                </div>
                <button className="btn btn-primary text-[12px] sm:text-[14px] rounded-lg sm:py-6 btn-sm sm:btn-md" onClick={() => {
                    openFormModal();
                    setId(0);
                    setFormTitle("Create Category");
                    setName("");
                }}>
                    Create Category
                </button>
            </div>
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-300">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Created At</th>
                            <th>Updated At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((c, index) => (
                            <tr key={index}>
                                <th>{c.id}</th>
                                <td>{c.name}</td>
                                <td>{c.created_at}</td>
                                <td>{c.updated_at}</td>
                                <td className="flex gap-2">
                                    <button onClick={() => {
                                        openFormModal();
                                        setFormTitle(`Update Category: ID_${c.id}`);
                                        setId(c.id);
                                        setName(c.name);
                                    }}>
                                        <Edit className="w-5 h-5 text-blue-500 cursor-pointer" />
                                    </button>
                                    <button onClick={() => {
                                        openDeleteModal();
                                        setFormTitle(`Delete Category: ${c.name} (ID_${c.id})`);
                                        setId(c.id);
                                        setName("");
                                    }}>
                                        <Trash2 className="w-5 h-5 text-red-500 cursor-pointer" />
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