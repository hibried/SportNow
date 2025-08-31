import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { FileCheck, FileX, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState("all");
    const [showExpired, setShowExpired] = useState(false);
    const [visibleRows, setVisibleRows] = useState(0);

    const navigate = useNavigate();

    const getTransactions = async () => {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/all-transaction?is_paginate=false`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            setTransactions(response.data.result);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTransactions();
    }, []);

    // Precompute today's timestamp at midnight
    const todayTimestamp = useMemo(() => {
        const t = new Date();
        t.setHours(0, 0, 0, 0);
        return t.getTime();
    }, []);

    // Count visible rows when status or data changes
    useEffect(() => {
        const count = transactions.filter((t) => {
            const expiredTimestamp = new Date(t.expired_date).setHours(0, 0, 0, 0);
            const isExpired = expiredTimestamp < todayTimestamp;

            const statusMatch = selectedStatus === "all" || t.status === selectedStatus;
            const expiredMatch = showExpired ? isExpired : !isExpired;

            return statusMatch && expiredMatch;
        }).length;

        setVisibleRows(count);
    }, [transactions, selectedStatus, showExpired, todayTimestamp]);

    return (
        <div className="p-3 pt-5 sm:p-8">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h1 className="text-2xl sm:text-[32px] font-extrabold bg-gradient-to-r from-indigo-600 to-cyan-500 text-transparent bg-clip-text dark:text-base-content">
                    TRANSACTION
                </h1>

                <div className="flex gap-2 sm:gap-3 items-center">
                    <button className={`btn btn-error ${showExpired ? "" : "btn-soft"} btn-sm sm:btn-md rounded-lg`} onClick={() => setShowExpired(!showExpired)}>
                        Expired
                        {!showExpired ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <select
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        defaultValue="All Statuses"
                        className="select select-primary select-sm sm:select-md rounded-lg w-35"
                    >
                        <option value="all">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="success">Success</option>
                        <option value="failed">Failed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div
                className="w-full rounded-tr-4xl rounded-bl-4xl shadow-xl border-4 border-transparent bg-base-100 overflow-x-auto max-h-190"
                style={{ background: "linear-gradient(90deg, #4f46e5, #06b6d4) border-box" }}
            >
                <table className="table table-zebra w-full">
                    <thead
                        className="text-white sticky top-0 z-10"
                        style={{ background: "linear-gradient(90deg, #4f46e5, #06b6d4) border-box" }}
                    >
                        <tr>
                            <th>USER ID</th>
                            <th>INVOICE ID</th>
                            <th>EXPIRED DATE</th>
                            <th>STATUS</th>
                            <th>TOTAL AMOUNT</th>
                            <th>ACTIVITY TITLE</th>
                            <th>ACTIVITY DATE</th>
                            <th>TIME</th>
                            <th>ADDRESS</th>
                        </tr>
                    </thead>

                    <tbody className="bg-base-300 relative">
                        {visibleRows > 0 ? (
                            transactions.map((t, index) => {
                                const expiredTimestamp = new Date(t.expired_date).setHours(0, 0, 0, 0);
                                const isExpired = expiredTimestamp < todayTimestamp; // <-- KEY CHANGE

                                return (
                                    <tr
                                        key={index}
                                        className={`hover:bg-base-200 transition-all duration-200 ${
                                            (selectedStatus !== "all" && t.status !== selectedStatus) ||
                                            (!showExpired && isExpired)
                                                ? "hidden"
                                                : ""
                                        }`}
                                    >
                                        <th className="font-medium">{t.user_id}</th>
                                        <td className="font-medium">
                                            <a
                                                onClick={() => navigate(`/transactions/invoice/${t.id}`)}
                                                className="link link-hover"
                                            >
                                                {t.invoice_id}
                                            </a>
                                        </td>

                                        {/* Show expired status visually */}
                                        <td>
                                            <span className={isExpired ? "text-red-500 font-semibold" : ""}>
                                                {t.expired_date}
                                            </span>
                                        </td>

                                        <td className="flex items-center gap-2">
                                            <span
                                                className={`tooltip tooltip-left ${
                                                    t.proof_payment_url ? "tooltip-success" : "tooltip-error"
                                                }`}
                                                data-tip={
                                                    t.proof_payment_url
                                                        ? "Has proof of payment"
                                                        : "No proof of payment"
                                                }
                                            >
                                                {t.proof_payment_url ? (
                                                    <FileCheck className="text-green-500 w-5 h-5" />
                                                ) : (
                                                    <FileX className="text-red-500 w-5 h-5" />
                                                )}
                                            </span>
                                            <span
                                                className={`font-bold badge ${
                                                    t.status === "pending"
                                                        ? "badge-warning"
                                                        : t.status === "success"
                                                        ? "badge-success"
                                                        : t.status === "cancelled"
                                                        ? "bg-gray-400 text-gray-700"
                                                        : t.status === "failed"
                                                        ? "badge-error"
                                                        : ""
                                                }`}
                                            >
                                                {t.status.toUpperCase()}
                                            </span>
                                        </td>

                                        <td>Rp{t.total_amount.toLocaleString("de-DE")}</td>
                                        <td className="text-nowrap">
                                            {t.transaction_items?.sport_activities?.title}
                                        </td>
                                        <td>{t.transaction_items?.sport_activities?.activity_date}</td>
                                        <td className="text-nowrap">
                                            {t.transaction_items?.sport_activities?.start_time.slice(0, 5)} -{" "}
                                            {t.transaction_items?.sport_activities?.end_time.slice(0, 5)}
                                        </td>
                                        <td className="max-w-50 truncate">
                                            {t.transaction_items?.sport_activities?.address}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center py-5">
                                    <p className="text-lg font-semibold">No transactions found.</p>
                                    <p className="text-sm text-gray-500">Try selecting a different status.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export { Transactions };