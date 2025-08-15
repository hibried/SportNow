// MyTransactionsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Receipt, Calendar, MapPin, DollarSign } from "lucide-react";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

const MyTransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/my-transaction`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
      console.log(response.data.result.data);
      setTransactions(response.data.result.data || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

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

  return (
    <div className="min-h-screen bg-base-200 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary mb-8 flex items-center justify-center gap-2">
          <Receipt className="w-8 h-8" />
          My Transactions
        </h1>

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
                    {trx.transaction_items?.sport_activities?.title}
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
                      {trx.status}
                    </span>
                  </p>

                  <div className="card-actions justify-end mt-4">
                    <a
                      href={`/payment-confirmation/${trx.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      View Details
                    </a>
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
