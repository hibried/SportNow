// ActivitiesPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Activity, MapPin, Search } from "lucide-react";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

export default function ActivitiesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);

    const initialPage = parseInt(query.get("page") || "1", 10);

    // Filters
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCategory, setSelectedCategory] = useState(query.get("category") || "");
    const [selectedProvince, setSelectedProvince] = useState(query.get("province") || "");
    const [selectedCity, setSelectedCity] = useState(query.get("city") || "");

    // Activities
    const [activities, setActivities] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);

    /* ------------------------
    Fetchers
    ------------------------ */
    useEffect(() => {
        fetchCategories();
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            fetchCities(selectedProvince).then((cityList) => {
            if (cityList.length > 0) {
                setSelectedCity(cityList[0].city_id); // auto-select first city
            } else {
                setSelectedCity("");
            }
            });
        } else {
            setCities([]);
            setSelectedCity(""); // reset when "All Provinces"
        }
    }, [selectedProvince]);

    useEffect(() => {
        // ✅ update state from URL whenever it changes
        const urlCategory = query.get("category") || "";
        const urlProvince = query.get("province") || "";
        const urlCity = query.get("city") || "";
        const urlPage = parseInt(query.get("page") || "1", 10);

        setSelectedCategory(urlCategory);
        setSelectedProvince(urlProvince);
        setSelectedCity(urlCity);
        setPage(urlPage);

        fetchActivities(urlPage, urlCategory, urlCity);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/sport-categories`);
            setCategories(res.data.result.data || []);
        } catch (err) {
            console.error("fetchCategories error:", err);
        }
    };

    const fetchProvinces = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/location/provinces`);
            setProvinces(res.data.result.data || []);
        } catch (err) {
            console.error("fetchProvinces error:", err);
        }
    };

    const fetchCities = async (provinceId) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/location/cities/${provinceId}`);
            const data = res.data.result.data || [];
            setCities(data);
            return data; // ✅ return list so caller can auto-select
        } catch (err) {
            console.error("fetchCities error:", err);
            return [];
        }
    };

    const fetchActivities = async (pageNum = 1, cat, city) => {
        try {
            const res = await axios.get(`${BASE_URL}/api/v1/sport-activities`, {
            params: {
                page: pageNum,
                per_page: 12,
                sport_category_id: cat || undefined,
                city_id: city || undefined,
            },
            });

            const data = res.data.result || {};
            setActivities(data.data || []);
            setPage(data.current_page || 1);
            setTotalPages(data.last_page || 1);
        } catch (err) {
            console.error("fetchActivities error:", err);
        }
    };

    /* ------------------------
    Handlers
    ------------------------ */
    const handleSearch = () => {
        const params = new URLSearchParams();
        if (selectedCategory) params.set("category", selectedCategory);
        if (selectedProvince) params.set("province", selectedProvince);
        if (selectedCity) params.set("city", selectedCity);

        params.set("page", "1"); // always reset to first page
        navigate(`/activities?${params.toString()}`);
    };

    const openActivity = (id) => {
        navigate(`/activities/${id}`);
    };

    /* ------------------------
        Render
        ------------------------ */
    return (
        <section className="py-12 md:py-20">
            <div className="max-w-6xl mx-auto px-4">
                {/* Filters */}
                <div className="card bg-base-100 shadow-md p-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">All Sports</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedProvince}
                            onChange={(e) => setSelectedProvince(e.target.value)}
                            className="select select-bordered w-full"
                        >
                            <option value="">All Provinces</option>
                            {provinces.map((p) => (
                                <option key={p.province_id} value={p.province_id}>
                                    {p.province_name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="select select-bordered w-full"
                            disabled={!selectedProvince}
                        >
                            {!selectedProvince ? (
                                <option value="">All Cities</option>
                            ) : null}
                            {cities.map((c) => (
                                <option key={c.city_id} value={c.city_id}>
                                    {c.city_name_full}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSearch}
                            className="btn btn-primary flex items-center gap-2"
                        >
                            <Search size={16} /> Search
                        </button>
                    </div>
                </div>

                {/* Results */}
                <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Activities</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {activities.length > 0 ? (
                        activities.map((a) => (
                            <motion.div
                            key={a.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45 }}
                            className="card bg-base-100 border hover:shadow-xl cursor-pointer overflow-hidden"
                            onClick={() => openActivity(a.id)}
                            >
                            <figure className="h-48 overflow-hidden">
                                <img
                                    src={
                                        a.image_url ||
                                        "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
                                    }
                                    alt={a.title}
                                    className="w-full h-full object-cover"
                                />
                            </figure>
                            <div className="card-body">
                                <h3 className="card-title text-lg">{a.title}</h3>
                                <p className="text-sm opacity-70 flex items-center gap-2">
                                    <Activity className="h-4 w-4" /> {a.sport_category?.name}
                                </p>
                                <p className="text-sm opacity-70 flex items-center gap-2">
                                    <MapPin className="h-4 w-4" /> {a.city?.city_name_full}
                                </p>
                                <div className="card-actions justify-end mt-2">
                                    <span className="badge badge-primary px-3 py-2">
                                        Rp {a.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            </motion.div>
                        ))
                        ) : (
                            <p className="col-span-full text-center opacity-70">No activities found</p>
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
                                onClick={() => fetchActivities(page - 1)}
                            >
                                ←
                            </button>

                            {/* Page Numbers (desktop only) */}
                            <div className="hidden md:flex">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                .filter((p) => p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2))
                                .map((p, idx, arr) => {
                                    const prev = arr[idx - 1];
                                    if (prev && p - prev > 1) {
                                    return (
                                        <React.Fragment key={p}>
                                        <button className="join-item btn btn-sm btn-disabled">
                                            ...
                                        </button>
                                        <button
                                            className={`join-item btn btn-sm ${
                                            p === page ? "btn-primary" : ""
                                            }`}
                                            onClick={() => fetchActivities(p)}
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
                                        onClick={() => fetchActivities(p)}
                                    >
                                        {p}
                                    </button>
                                    );
                                })}
                            </div>

                            {/* Next */}
                            <button
                                className="join-item btn btn-sm"
                                disabled={page === totalPages}
                                onClick={() => fetchActivities(page + 1)}
                            >
                                →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
