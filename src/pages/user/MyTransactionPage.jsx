// MyTransactionPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { Search, Calendar, MapPin } from "lucide-react";
import CountUp from "react-countup";

import Footer from "../../components/public/landing_page/Footer";
import Hero from "../../components/user/my_transaction_page/Hero";
import ActivitiesSkeletonGrid from "../../components/ActivitiesSkeletonGrid";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

export default function MyTransactionPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const initialPage = parseInt(query.get("page") || "1", 10);
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [enteredSearch, setEnteredSearch] = useState(query.get("search") || "");
    const [selectedStatus, setSelectedStatus] = useState(query.get("status") || "");
    const [isLoading, setIsLoading] = useState(true);

    /* ------------------------
       Fetch all transactions
    ------------------------ */
    useEffect(() => {
        const urlSearch = query.get("search") || "";
        const urlStatus = query.get("status") || "";
        const urlPage = parseInt(query.get("page") || "1", 10);

        setEnteredSearch(urlSearch);
        setPage(urlPage);

        getTransactions(urlSearch);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const getTransactions = async (search) => {
        try {
            const token = localStorage.getItem("accessToken");
            const response = await axios.get(`${BASE_URL}/api/v1/my-transaction`, {
                params: {
                    is_paginate: false, // fetch all, we'll paginate client-side
                    search: search || undefined,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = response.data.result || {};
            setTransactions(data || []);
        } catch (err) {
            console.error("getTransactions error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    /* ------------------------
       Filtering + Pagination
    ------------------------ */
    const filteredTransactions = selectedStatus
        ? transactions.filter((t) => t.status === selectedStatus)
        : transactions;

    const perPage = 6;
    const totalPages = Math.ceil(filteredTransactions.length / perPage);
    const paginatedTransactions = filteredTransactions.slice(
        (page - 1) * perPage,
        page * perPage
    );

    /* ------------------------
       Handlers
    ------------------------ */
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (enteredSearch) params.set("search", enteredSearch);
        params.set("page", "1");
        navigate(`/my-transaction?${params.toString()}`);
    };

    const updatePage = (newPage) => {
        const params = new URLSearchParams();
        if (enteredSearch) params.set("search", enteredSearch);
        params.set("page", newPage);
        navigate(`/my-transaction?${params.toString()}`);
    };

    const onOpenTransaction = (id) => {
        navigate(`/my-transaction/${id}`);
    };

    /* ------------------------
       Render
    ------------------------ */
    return (
        <>
            <Hero />
            <section className="py-12 md:py-20 min-h-screen">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Filters */}
                    <div className="card bg-base-100 shadow-md p-4 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-3">
                            {/* Search input */}
                            <label className="input w-full">
                                <Search className="h-[1em] opacity-50" />
                                <input
                                    value={enteredSearch}
                                    onChange={(e) => setEnteredSearch(e.target.value)}
                                    type="search"
                                    placeholder="Search invoice or title"
                                />
                            </label>

                            {/* Search button */}
                            <button
                                onClick={handleSearch}
                                className="btn btn-primary flex items-center gap-2"
                            >
                                <Search size={16} /> Search
                            </button>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="flex justify-between items-end mb-4 text-sm text-gray-400">
                        <p>
                            Showing{" "}
                            <span className="text-black font-semibold dark:text-white">
                                <CountUp end={filteredTransactions.length} duration={1} /> transactions
                            </span>
                        </p>
                        {/* Status filter */}
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                className="select select-bordered select-sm sm:select-md rounded-lg w-35"
                            >
                                <option value="">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="success">Success</option>
                                <option value="failed">Failed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {isLoading ? (
                            <ActivitiesSkeletonGrid length={3} />
                        ) : paginatedTransactions.length > 0 ? (
                            paginatedTransactions.map((t) => (
                                <motion.div
                                    key={t.id}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.45 }}
                                    onClick={() => onOpenTransaction(t.id)}
                                    className="card bg-base-100 border hover:shadow-xl overflow-hidden cursor-pointer"
                                >
                                    <div className="card-body space-y-3">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-mono text-gray-500">
                                                #{t.invoice_id}
                                            </p>
                                            <span
                                                className={`badge font-semibold px-3 py-2 text-xs ${
                                                    t.status === "pending"
                                                        ? "badge-warning"
                                                        : t.status === "success"
                                                        ? "badge-success"
                                                        : t.status === "cancelled"
                                                        ? "bg-gray-300 text-gray-600"
                                                        : t.status === "failed"
                                                        ? "badge-error"
                                                        : ""
                                                }`}
                                            >
                                                {t.status.toUpperCase()}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-lg font-bold">
                                            {t.transaction_items?.title}
                                        </h3>

                                        {/* Activity Info */}
                                        <div className="space-y-1 text-xs opacity-70">
                                            <p className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4" />{" "}
                                                {t.transaction_items?.sport_activities?.address}
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />{" "}
                                                {new Date(t.order_date).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Amount */}
                                        <div className="flex justify-end mt-2">
                                            <span className="badge badge-primary text-sm px-4 py-2 font-bold">
                                                Rp {t.total_amount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <p className="col-span-full text-center opacity-70">
                                No transactions found
                            </p>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center mt-10">
                            <div className="join">
                                {/* Previous */}
                                <button
                                    className="join-item btn btn-sm"
                                    disabled={page === 1}
                                    onClick={() => updatePage(page - 1)}
                                >
                                    ←
                                </button>

                                {/* Page Numbers */}
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(
                                        (p) =>
                                            p === 1 ||
                                            p === totalPages ||
                                            (p >= page - 2 && p <= page + 2)
                                    )
                                    .map((p, idx, arr) => {
                                        const prev = arr[idx - 1];
                                        if (prev && p - prev > 1) {
                                            return (
                                                <React.Fragment key={p}>
                                                    <button className="join-item btn btn-sm btn-disabled">...</button>
                                                    <button
                                                        className={`join-item btn btn-sm ${
                                                            p === page ? "btn-primary" : ""
                                                        }`}
                                                        onClick={() => updatePage(p)}
                                                    >
                                                        {p}
                                                    </button>
                                                </React.Fragment>
                                            );
                                        }
                                        return (
                                            <button
                                                key={p}
                                                className={`join-item btn btn-sm ${
                                                    p === page ? "btn-primary" : ""
                                                }`}
                                                onClick={() => updatePage(p)}
                                            >
                                                {p}
                                            </button>
                                        );
                                    })}

                                {/* Next */}
                                <button
                                    className="join-item btn btn-sm"
                                    disabled={page === totalPages}
                                    onClick={() => updatePage(page + 1)}
                                >
                                    →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </>
    );
}
