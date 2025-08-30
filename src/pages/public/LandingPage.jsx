import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Navbar from "../../components/public/Navbar";
import Hero from "../../components/public/landing_page/Hero";
import Features from "../../components/public/landing_page/Features";
import ActivitiesShowcase from "../../components/public/landing_page/ActivitiesShowcase";
import Pricing from "../../components/public/landing_page/Pricing";
import TestimonialsCarousel from "../../components/public/landing_page/TestimonialsCarousel";
import FAQ from "../../components/public/landing_page/FAQ";
import CTA from "../../components/public/landing_page/CTA";
import Footer from "../../components/public/landing_page/Footer";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

/* -------------------------
   Small animation variants
   ------------------------- */
const container = {
	hidden: { opacity: 0 },
	show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
	hidden: { opacity: 0, y: 12 },
	show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 80 } },
};

/* -------------------------
Full Page (main exported)
------------------------- */
export default function LandingPage() {
	const navigate = useNavigate();

	// API-driven states
	const [categories, setCategories] = useState([]);
	const [provinces, setProvinces] = useState([]);
	const [cities, setCities] = useState([]);
	const [activities, setActivities] = useState([]);
	// const [page, setPage] = useState(1);
	// const [totalPages, setTotalPages] = useState(1);

	// filters
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedProvince, setSelectedProvince] = useState("");
	const [selectedCity, setSelectedCity] = useState("");

	const [isActivityLoading, setIsActivityLoading] = useState(false);

	/* Fetchers */
	useEffect(() => {
		fetchCategories();
		fetchProvinces();
		fetchActivities(1);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
		if (!provinceId) {
			setCities([]);
			return;
		}
		try {
			const res = await axios.get(`${BASE_URL}/api/v1/location/cities/${provinceId}`);
			setCities(res.data.result.data || []);
		} catch (err) {
			console.error("fetchCities error:", err);
		}
	};

	const fetchActivities = async (pageNum = 1, append = false) => {
		setIsActivityLoading(true);
		try {
			const res = await axios.get(`${BASE_URL}/api/v1/sport-activities`, {
				params: {
					page: pageNum,
					per_page: 3,
					sport_category_id: selectedCategory || undefined,
					city_id: selectedCity || undefined,
				},
			});

			const data = res.data.result || {};
			// setActivities((prev) => (append ? [...prev, ...(data.data || [])] : data.data || []));
			setActivities(data.data || []);
			// setPage(data.current_page || 1);
			// setTotalPages(data.last_page || 1);
		} catch (err) {
			console.error("fetchActivities error:", err);
		} finally {
			setIsActivityLoading(false);
		}
	};

	/* Handlers */
	const handleProvinceChange = (val) => {
		setSelectedProvince(val);
		setSelectedCity("");
		fetchCities(val);
	};

	const handleSearch = () => {
		const params = new URLSearchParams();
		if (selectedCategory) params.set("category", selectedCategory);
		if (selectedProvince) params.set("province", selectedProvince);
		if (selectedCity) params.set("city", selectedCity);

		navigate(`/activities?${params.toString()}`);
	};

	const openActivity = (id) => {
		navigate(`/activities/${id}`);
	};

	return (
		<div className="min-h-screen bg-base-100 text-base-content">
			<Hero
				categories={categories}
				provinces={provinces}
				cities={cities}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				selectedProvince={selectedProvince}
				setSelectedProvince={handleProvinceChange}
				selectedCity={selectedCity}
				setSelectedCity={setSelectedCity}
				onSearch={handleSearch}
				openActivity={() => navigate("/activities")}
			/>

			<main>
				<Features container={container} item={item} />

				<ActivitiesShowcase activities={activities} isActivityLoading={isActivityLoading} onOpenActivity={openActivity} />

				{/* Load more */}
				{/* {page < totalPages && (
					<div className="flex justify-center my-8">
						<button
						onClick={() => fetchActivities(page + 1, true)}
						className="btn btn-outline btn-primary rounded-full px-6"
						>
						Load More
						</button>
					</div>
				)} */}

				<TestimonialsCarousel />

				<Pricing />

				<FAQ />

				<CTA />
			</main>

			<Footer />
		</div>
	);
}
