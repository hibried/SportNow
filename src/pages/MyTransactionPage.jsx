// MyTransactionsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Receipt, Calendar, MapPin, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

const MyTransactionPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [temp, setTemp] = useState('');

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTransactions = async (pageNum) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/v1/my-transaction?per_page=9&page=${page}`, {
                headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                },
            });
            console.log(response.data.result.data);
            setTransactions(response.data.result.data || []);
            setPage(response.data.result.current_page);
            setTotalPages(response.data.result.last_page);
        } catch (error) {
            console.error("Failed to fetch transactions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions(page);
    }, [temp, page]);

    const goToNextPage = () => {
        if (page < totalPages) setPage(page + 1);
    };

    const goToPreviousPage = () => {
        if (page > 1) setPage(page - 1);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "pending":
                return "text-yellow-500";
            case "success":
                return "text-green-500";
            case "failed":
                return "text-red-500";
            default:
                return "text-gray-500";
        }
    };

    async function handleCancelTransaction(id, title) {
        const cancel = confirm(`Cancel ${title} (${id})?`);
        if(cancel){
            try {
                const response = await axios.post(`${BASE_URL}/api/v1/transaction/cancel/${id}`, null, {
                    headers: {
                        Authorization: `Bearer ${BEARER_TOKEN}`,
                        Accept: 'application/json',
                    },
                });
                alert(`${title} (${id}): ${response.data.message}`);
                setTemp(id);
            } catch (error) {
                alert(error);
            }
        }
    }

    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-base-200 py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-center text-primary flex items-center gap-2">
                        <Receipt className="w-8 h-8" />
                        My Transactions
                    </h1>
                    <div className="join">
                        <button onClick={goToPreviousPage} disabled={page === 1} className="join-item btn btn-neutral rounded-l-lg btn-sm sm:btn-md">«</button>
                        <button className="hidden sm:block join-item btn btn-primary">{page}</button>
                        <button onClick={goToNextPage}  disabled={page === totalPages} className="join-item btn btn-neutral rounded-r-lg btn-sm sm:btn-md">»</button>
                    </div>
                </div>
                

                {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="animate-spin w-10 h-10 text-primary" />
                </div>
                ) : transactions.length === 0 ? (
                <p className="text-center text-gray-500 dark:text-gray-400">
                    No transactions found.
                </p>
                ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {transactions.map((trx) => (
                        <div
                            key={trx.id}
                            className="card bg-base-100 shadow-xl border-t-4 border-primary hover:shadow-2xl transition-all"
                        >
                            <div className="card-body">
                                <h2 className="card-title text-lg font-bold">
                                    {trx.transaction_items?.sport_activities?.title.toUpperCase()}
                                </h2>

                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <DollarSign className="w-4 h-4 text-success" />
                                    Rp {trx.total_amount?.toLocaleString("id-ID")}
                                </p>

                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <Calendar className="w-4 h-4 text-info" />
                                    {trx.transaction_items?.sport_activities?.activity_date}
                                </p>

                                <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                    <MapPin className="w-4 h-4 text-warning" />
                                    {trx.transaction_items?.sport_activities?.address}
                                </p>

                                <p className="mt-2">
                                    Status:{" "}
                                    <span
                                        className={`font-bold ${getStatusColor(trx.status)}`}
                                    >
                                        {trx.status.toUpperCase()}
                                    </span>
                                </p>

                                <div className="card-actions justify-end mt-4">
                                    {trx.status === 'pending' &&
                                        <button
                                            onClick={() => handleCancelTransaction(trx.id, trx.transaction_items?.sport_activities?.title.toUpperCase())}
                                            className="btn btn-soft btn-error btn-sm"
                                        >
                                            Cancel
                                        </button>
                                    }
                                    <button
                                        onClick={() => navigate(`/transaction/${trx.id}/confirm`)}
                                        href={`/payment-confirmation/${trx.id}`}
                                        className="btn btn-primary btn-sm"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
};

export default MyTransactionPage;
