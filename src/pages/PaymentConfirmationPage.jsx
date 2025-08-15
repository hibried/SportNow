import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

function PaymentConfirmationPage() {
  const { id } = useParams();
  const [transaction, setTransaction] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchTransactionById() {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/transaction/${id}`, {
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          Accept: "application/json",
        },
      });
      // console.log(response.data.result);
      setTransaction(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchTransactionById();
  }, []);

  const handleFileChange = (e) => {
    setProofFile(e.target.files[0]);
  };
  
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!proofFile) {
      alert("Please upload proof of payment.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Replace with your actual upload API request
      const formData = new FormData();
      formData.append("file", proofFile);

      console.log("Uploading proof...", proofFile);

      // Example:
      // await axios.post(`/api/payments/${paymentData.id}/confirm`, formData);
      const response = await axios.post(`${BASE_URL}/api/v1/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Payment proof submitted successfully!");
      navigate('/my-transaction');
    } catch (error) {
      console.error(error);
      alert("Failed to submit payment proof.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activity = transaction?.transaction_items?.sport_activities;

  if (!transaction && !activity) {
      return (
          <div className="flex items-center justify-center min-h-screen">
              <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
        {/* Header */}
        <h1 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
          Payment Confirmation
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          Please review your transaction details before confirming payment.
        </p>

        {/* Invoice Info */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <p className="font-semibold text-gray-800 dark:text-gray-100">
            Invoice: {transaction.invoice_id}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Status:{" "}
            <span
              className={`font-bold ${
                transaction.status === "pending"
                  ? "text-yellow-500"
                  : transaction.status === "success"
                  ? "text-green-500"
                  : transaction.status === "failed"
                  ? "text-red-500"
                  : ""
              }`}
            >
              {transaction.status.toUpperCase()}
            </span>
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Order Date: {transaction.order_date}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Expired Date: {transaction.expired_date}
          </p>
        </div>

        {/* Activity Details */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
            Activity Details
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="font-bold text-gray-800 dark:text-gray-100">
              {activity?.title.toUpperCase()}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              {activity?.address}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Date: {activity?.activity_date}
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Time: {activity?.start_time} - {activity?.end_time}
            </p>
            {activity?.map_url && (
              <a
                href={activity?.map_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-blue-500 hover:underline"
              >
                View Location
              </a>
            )}
          </div>
        </div>

        {/* Total Amount */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-2">
            Payment Summary
          </h2>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex justify-between items-center">
            <span className="text-gray-800 dark:text-gray-100">Total</span>
            <span className="text-xl font-bold text-green-600 dark:text-green-400">
              Rp{transaction.total_amount}
            </span>
          </div>
        </div>

        {/* Proof Upload */}
        {transaction.status !== 'cancelled' && transaction.status !== 'success' &&
          <div className="mb-6">
            <label className="block font-semibold text-gray-800 dark:text-gray-100 mb-2">
              Upload Proof of Payment
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full max-w-xs"
            />
          </div>
        }

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button onClick={() => navigate('/my-transaction')} className="btn btn-primary">Back to My Transactions</button>
          {transaction.status !== 'cancelled' && transaction.status !== 'success' &&
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !proofFile}
              className={`btn btn-success ${
                isSubmitting || !proofFile ? "btn-disabled" : ""
              }`}
            >
              {isSubmitting ? "Submitting..." : "Confirm Payment"}
            </button>
          }
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirmationPage