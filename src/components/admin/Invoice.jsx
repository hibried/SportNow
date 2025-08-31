import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axios from "axios";

import Footer from "../public/landing_page/Footer";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
// const CURRENT_ROLE = localStorage.getItem("role");

// Currency formatter for Indonesian Rupiah
const formatCurrency = (value) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
    }).format(value);

// BE CAREFUL, IT'S FOR ADMIN AND USER
function Invoice() {

    const { id } = useParams();
    const [transaction, setTransaction] = useState({});
    const [proofPaymentUrl, setProofPaymentUrl] = useState("");
    const [currentUser, setCurrentUser] = useState({});
    const [currentRole, setCurrentRole] = useState("");
    const [isOwner, setIsOwner] = useState(false); // <-- changed to boolean

    const [newStatus, setNewStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // USER
    const [proofFile, setProofFile] = useState(null);
    //

    const item = transaction?.transaction_items;
    const activity = item?.sport_activities;

    const navigate = useNavigate();

    const handlePrint = () => {
        window.print();
    };

    const hasDatePassed = (dateString) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of the day

        const inputDate = new Date(dateString);
        inputDate.setHours(0, 0, 0, 0); // Normalize input date

        return inputDate < today;
    };

    const openImage = (link) => {
        const imageUrl = link;
        window.open(imageUrl, "_blank");
    };

    async function getCurrentUser() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            setCurrentUser(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    async function getTransaction() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/transaction/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            // console.log(response.data.result);
            if(response.data.result){
                setTransaction(response.data.result);
            } else {
                navigate(-1);
            }
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
        }
    }

    // FOR ADMIN
    function openConfirmationModal() {
        document.getElementById("confirmation_modal").showModal();
    }

    async function updateTransactionStatus() {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/transaction/update-status/${id}`, {
                status: newStatus.toLowerCase()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
            });
            console.log(response.data);
            getTransaction(); // Refresh transaction data
            document.getElementById("confirmation_modal").close();
            toast.success("Transaction status updated successfully");
        } catch (error) {
            console.error(error.response?.data?.message || error.message);
            toast.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    //

    // FOR USER
    const handleFileSubmit = async(url) => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.post(`${BASE_URL}/api/v1/transaction/update-proof-payment/${id}`, 
                {
                    proof_payment_url: url,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            );
            console.log(response.data.message);
        } catch (error) {
            throw new Error(error);
        }
    }

    const handleFileUpload = async (e) => {
        const proofFile = e.target.files[0];

		if (!proofFile) {
			toast.error("Please upload proof of payment.");
			return;
		}

		try {
			// Replace with your actual upload API request
			const formData = new FormData();
			formData.append("file", proofFile);

			console.log("Uploading proof...", proofFile);

			// Example:
			// await axios.post(`/api/payments/${paymentData.id}/`, formData);
			const response = await axios.post(`${BASE_URL}/api/v1/upload-image`, formData, {
				headers: {
				    'Content-Type': 'multipart/form-data',
				},
			});
            // console.log(response.data.result);
            setProofPaymentUrl(response.data.result);
            await handleFileSubmit(response.data.result);
			toast.success("Payment proof submitted successfully!");
		} catch (error) {
			console.error(error);
			toast.error("Failed to submit payment proof.");
		}
	};
    //

    useEffect(() => {
        getCurrentUser();
        getTransaction();
        setCurrentRole(localStorage.getItem("role"));
    }, []);

    // Ownership check: only owner (or admin) can view invoice
    useEffect(() => {
        // wait until both are loaded
        if (!transaction?.user_id) return; // transaction not loaded yet
        // if current role is admin, allow
        if (currentRole === "admin") {
            setIsOwner(true);
            return;
        }
        // if currentUser not loaded yet, wait
        if (!currentUser?.id) return;

        if (currentUser.id !== transaction.user_id && currentRole !== "admin") {
            toast.error("You are not authorized to view this invoice.");
            // redirect to a safe page (adjust as desired)
            navigate("/my-transaction");
        } else {
            setIsOwner(true);
        }
    }, [currentUser, transaction, navigate, currentRole]);

    useEffect(() => {
        setProofPaymentUrl(
            transaction?.proof_payment_url?.includes("http://localhost:4030") ?
            transaction?.proof_payment_url?.replace("http://localhost:4030", BASE_URL) :
            transaction?.proof_payment_url
        );
    }, [transaction]);

    // while ownership not confirmed, show loading (prevents flash of content)
    if (!isOwner && (transaction?.user_id || currentUser?.id)) {
        // We have loaded data and ownership check ran -> redirect already happened above
        return null;
    }

    return (
        <>
            <div className="p-3 pt-5 sm:p-8 flex flex-col items-center">
                {/* Invoice Container */}
                <div
                    className="w-full max-w-3xl rounded-tr-4xl rounded-bl-4xl shadow-2xl border-4 border-transparent bg-base-100 text-base-content overflow-hidden"
                    style={{ background: "linear-gradient(90deg, #4f46e5, #06b6d4) border-box" }}
                >
                    <div className="bg-base-100 p-4 sm:p-8">
                        {/* Header with Gradient */}
                        <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white rounded-tr-2xl p-4 sm:p-6 mb-6 shadow-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold">SportNow Booking</h1>
                                <p className="text-sm">www.sportnow-booking.com</p>
                            </div>
                            <div className="text-left sm:text-right">
                                <p className="text-xs sm:text-sm">Invoice No:</p>
                                <p className="text-base sm:text-lg font-semibold">{transaction?.invoice_id}</p>
                                <div className="flex flex-row-reverse sm:flex-row justify-end items-center gap-6 mt-2">
                                    {currentRole === "admin" && transaction?.status === "pending" && (
                                        <div className="flex gap-2">
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" 
                                                onClick={() => {
                                                    setNewStatus("Success");
                                                    openConfirmationModal();
                                                }}
                                            >
                                                <CheckCircle size={20} className="stroke-white" />
                                            </button>
                                            <button
                                                className="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" 
                                                onClick={() => {
                                                    setNewStatus("Failed");
                                                    openConfirmationModal();
                                                }}
                                            >
                                                <XCircle size={20} className="stroke-white" />
                                            </button>
                                        </div>
                                    )}
                                    <span
                                        className={`font-bold badge ${
                                            transaction?.status === "pending"
                                                ? "badge-warning"
                                                : transaction?.status === "success"
                                                ? "badge-success"
                                                : transaction?.status === "cancelled"
                                                ? "bg-gray-400 text-gray-700"
                                                : transaction?.status === "failed"
                                                ? "badge-error"
                                                : ""
                                        }`}
                                    >
                                        {transaction?.status?.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            <div>
                                <p className="font-semibold">Invoice Date:</p>
                                <p>{transaction?.order_date}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Due Date:</p>
                                <p className={hasDatePassed(transaction?.expired_date) ? "text-red-600 font-bold" : ""}>
                                    {transaction?.expired_date} {hasDatePassed(transaction?.expired_date) ? "(Past Due)" : ""}
                                </p>
                            </div>
                        </div>

                        {/* Buyer Details */}
                        <div className="mb-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-2">Bill To:</h2>
                            <div className="bg-base-200 p-3 sm:p-4 rounded-lg">
                                <p>User ID: {transaction?.user_id}</p>
                            </div>
                        </div>

                        {/* Order Details */}
                        <div className="mb-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-2">Order Details:</h2>
                            <div className="overflow-x-auto">
                                <table className="table w-full border border-base-300 rounded-lg text-sm sm:text-base">
                                    <thead className="bg-base-200">
                                        <tr>
                                            <th>Activity</th>
                                            <th>Date & Time</th>
                                            <th>Location</th>
                                            <th className="text-right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <p className="font-medium">{item?.title}</p>
                                                <p className="text-xs sm:text-sm opacity-70">{activity?.title}</p>
                                            </td>
                                            <td>
                                                {activity?.activity_date} <br />
                                                {activity?.start_time?.slice(0,5)} - {activity?.end_time?.slice(0,5)}
                                            </td>
                                            <td>
                                                <a
                                                    href={activity?.map_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="link link-primary"
                                                >
                                                    {activity?.address}
                                                </a>
                                            </td>
                                            <td className="text-right">{formatCurrency(item?.price)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="flex justify-end">
                            <div className="w-full sm:w-1/2">
                                {item?.price_discount && (
                                    <div className="flex justify-between mb-2 text-sm sm:text-base">
                                        <span>Original Price:</span>
                                        <span className="line-through">{formatCurrency(item?.price_discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-base sm:text-lg border-t pt-2">
                                    <span>Total:</span>
                                    <span>{formatCurrency(transaction?.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Proof of Payment */}
                        <div className="mt-6">
                            <h2 className="text-base sm:text-lg font-semibold mb-2">Proof of Payment:</h2>
                            {currentRole === "user" && transaction.status === "pending" && !hasDatePassed(transaction?.expired_date) && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="file-input file-input-primary mb-3 file-input-sm sm:file-input-md"
                                />
                            )}
                            {transaction?.proof_payment_url || proofPaymentUrl ? (
                                <img
                                    src={proofPaymentUrl}
                                    title="Proof of Payment"
                                    onClick={() => openImage(proofPaymentUrl)}
                                    onError={() => setProofPaymentUrl("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsBGOs2225fFqTfnl5EKlrEUBn5-drby1x3Q&s")}
                                    alt="Proof of Payment"
                                    className="w-full max-w-xs sm:max-w-sm rounded-lg border border-base-300 cursor-pointer"
                                />
                            ) : (
                                <p className="mb-2 italic opacity-70">No proof of payment uploaded.</p>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {currentRole === "user" && (
                            <div className="flex justify-center mt-10">
                                <button onClick={() => navigate("/my-transaction")} className="btn btn-sm sm:btn-md btn-primary">Back to My Transactions</button>
                            </div>
                        )}
                        

                        {/* Footer */}
                        <div className="mt-8 text-center text-xs sm:text-sm opacity-70">
                            <p>Thank you for your payment!</p>
                            <p>For inquiries, contact support@sportnow-booking.com</p>
                        </div>
                    </div>
                </div>

                {/* DELETE MODAL */}
                <dialog id="confirmation_modal" className="modal">
                    <div className="modal-box">
                        <h3 className="flex items-center gap-2 font-bold text-lg mb-3">
                            Update Status as <span className={`badge ${newStatus === "Success" ? "badge-success" : "badge-error"}`}>{newStatus.toUpperCase()}</span>
                        </h3>
                        <p className="py-4">The status cannot be changed afterwards. Are you sure?</p>
                        <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn" disabled={isLoading}>No</button>
                            </form>
                            <button onClick={updateTransactionStatus} className={`btn btn-primary ${isLoading ? "loading" : ""}`}>Yes</button>
                        </div>
                    </div>
                </dialog>
            </div>
            {currentRole === "user" && (
                <Footer />
            )}
        </>
    );
}

export { Invoice }
