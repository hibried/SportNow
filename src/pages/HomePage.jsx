import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

export default function HomePage() {
    const [categories, setCategories] = useState([]);
    const [activities, setActivities] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    const navigate = useNavigate();

    async function fetchCategories() {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-categories`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    Accept: "application/json",
                },
            });
            // console.log(response.data.result.data);
            setCategories(response.data.result.data || []);
        } catch (error) {
            console.error(error);
        }
    }

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, []);

    async function fetchActivities(category) {
        let url = `${BASE_URL}/api/v1/sport-activities?is_paginate=true&per_page=9`;
        if (selectedCategory) {
            url += `&sport_category_id=${selectedCategory}`;
        }

        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    Accept: "application/json",
                },
            });
            console.log(response.data.result.data);
            setActivities(response.data.result.data || []);
        } catch (error) {
            console.error(error);
        }
    }

    // Fetch activities
    useEffect(() => {
        fetchActivities(selectedCategory);
    }, [selectedCategory]);

    return (
        <div className="bg-base-200 min-h-screen">
            {/* Hero Section */}
            <div className="hero min-h-[50vh]" style={{ backgroundImage: "url('/sports-bg.jpg')" }}>
                <div className="hero-overlay bg-opacity-50"></div>
                <div className="hero-content text-center text-neutral-content">
                    <div>
                        <h1 className="mb-5 text-5xl font-bold">Find & Book Your Sport Activity</h1>
                        <p className="mb-5 text-lg">
                            Explore various sports categories and join activities around you.
                        </p>
                        <a href="#activities" className="btn btn-primary btn-lg">
                            Explore Now
                        </a>
                    </div>
                </div>
            </div>

            {/* Categories Filter */}
            <div className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">Categories</h2>
                <div className="flex flex-wrap gap-3">
                <button
                    onClick={() => setSelectedCategory("")}
                    className={`btn btn-outline ${!selectedCategory ? "btn-primary" : ""}`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`btn btn-outline ${selectedCategory === cat.id ? "btn-primary" : ""}`}
                    >
                        {cat.name}
                    </button>
                ))}
                </div>
            </div>

            {/* Activities */}
            <div id="activities" className="container mx-auto py-8">
                <h2 className="text-2xl font-bold mb-4">Sport Activities</h2>
                {activities.length === 0 ? (
                <p>No activities found.</p>
                ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {activities.map((act) => (
                    <div key={act.id} className="card bg-base-100 shadow-xl">
                        {/* <figure>
                        <img
                            src={act.image_url || "/default-sport.jpg"}
                            alt={act.title}
                            className="w-full h-48 object-cover"
                        />
                        </figure> */}
                        <div className="card-body">
                            <h3 className="card-title">{act.title}</h3>
                            <p>{act.description}</p>
                            <p className="text-sm text-gray-500">{act.address}</p>
                            <div className="card-actions justify-between mt-4">
                                <span className="font-bold text-primary">
                                    Rp {act.price?.toLocaleString()}
                                </span>
                                <button onClick={() => navigate(`/activity/${act.id}`)} className="btn btn-sm btn-primary">See Details</button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </div>
        </div>
    );
}