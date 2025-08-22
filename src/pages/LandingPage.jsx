import { useEffect, useState } from "react";
import axios from "axios";
import { Search, MapPin, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

export default function LandingPage() {
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchProvinces();
        fetchActivities(1);
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-categories`);
            setCategories(response.data.result.data || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const fetchProvinces = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/location/provinces`);
            setProvinces(response.data.result.data || []);
        } catch (error) {
            console.error("Failed to fetch provinces", error);
        }
    };

    const fetchCities = async (provinceId) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/location/cities/${provinceId}`);
            setCities(response.data.result.data || []);
        } catch (error) {
            console.error("Failed to fetch cities", error);
        }
    };

    const fetchActivities = async (pageNum = 1) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-activities`, {
                params: {
                page: pageNum,
                per_page: 6,
                sport_category_id: selectedCategory || undefined,
                city_id: selectedCity || undefined,
                },
            });

            setActivities(response.data.result.data || []);
            setPage(response.data.result.current_page);
            setTotalPages(response.data.result.last_page || 1);
        } catch (error) {
            console.error("Failed to fetch activities", error);
        }
    };

    const handleProvinceChange = (id) => {
        setSelectedProvince(id);
        setSelectedCity("");
        fetchCities(id);
    };

    const handleSearch = () => {
        fetchActivities(1);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Hero */}
            <div
                className="relative bg-cover bg-center h-80"
                style={{
                    backgroundImage:
                    "url('https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=1600&q=80')",
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center items-center text-center px-4 dark:from-black/80 dark:via-black/50">
                    <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-wide">
                        <span className="text-white">Find Your Next</span> <span className="text-orange-500">Sport Event</span>
                    </h1>
                    <p className="mt-3 text-lg text-gray-200 dark:text-gray-300">
                        Search, join, and challenge yourself near you
                    </p>
                    <div className="mt-6 flex gap-3">
                        <button className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white font-semibold shadow-lg transition-transform hover:scale-105">
                            Get Started
                        </button>
                        <button className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-2 rounded-full font-semibold transition-transform hover:scale-105">
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-6xl mx-auto px-4 py-10 grid gap-4 md:grid-cols-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="select w-full rounded-full bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedProvince}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="select w-full rounded-full bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
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
                    className="select w-full rounded-full bg-white text-gray-900 border-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700"
                    disabled={!selectedProvince}
                >
                    <option value="">All Cities</option>
                    {cities.map((c) => (
                        <option key={c.city_id} value={c.city_id}>
                            {c.city_name_full}
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleSearch}
                    className="bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105"
                >
                    <Search size={18} /> Search
                </button>
            </div>

            {/* Activities Grid */}
            <div className="max-w-6xl mx-auto px-4 pb-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 flex-grow">
                {activities.length > 0 ? (
                    activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="bg-white border border-gray-200 shadow-md hover:shadow-orange-500/50 transition-transform hover:-translate-y-2 cursor-pointer rounded-xl overflow-hidden dark:bg-gray-800 dark:border-gray-700"
                            onClick={() => navigate(`/activities/${activity.id}`)}
                        >
                            <figure>
                                <img
                                    src={
                                    activity.image_url ||
                                    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
                                    }
                                    alt={activity.title}
                                    className="h-48 w-full object-cover transform hover:scale-105 transition-transform duration-300"
                                />
                            </figure>
                            <div className="p-5">
                                <h2 className="text-lg font-bold uppercase">{activity.title}</h2>
                                <p className="text-sm text-gray-500 flex items-center gap-1 dark:text-gray-400">
                                    <Activity size={16} /> {activity.sport_category?.name}
                                </p>
                                <p className="text-sm text-gray-500 flex items-center gap-1 dark:text-gray-400">
                                    <MapPin size={16} /> {activity.city?.city_name_full}
                                </p>
                                <div className="flex justify-end mt-3">
                                    <span className="bg-orange-500 text-white font-semibold px-3 py-1 rounded-full">
                                        Rp {activity.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500 dark:text-gray-400">
                        No activities found
                        </p>
                    )
                }
            </div>

            {/* Load More */}
            {page < totalPages && (
                <div className="flex justify-center mb-12">
                    <button
                    onClick={() => fetchActivities(page + 1)}
                    className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-2 rounded-full font-bold transition-transform hover:scale-105"
                    >
                    Load More
                    </button>
                </div>
            )}

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 dark:bg-gray-900 dark:border-gray-700">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
                    <p className="text-gray-500 text-sm dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Sportify. All rights reserved.
                    </p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-orange-500 transition">
                            About
                        </a>
                        <a href="#" className="hover:text-orange-500 transition">
                            Contact
                        </a>
                        <a href="#" className="hover:text-orange-500 transition">
                            Privacy
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );

}
