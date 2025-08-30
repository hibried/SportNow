import { useState, useEffect } from "react";
import CountUp from "react-countup";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

function Dashboard() {
    const [totalCategories, setTotalCategories] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalSportActivities, setTotalSportActivities] = useState(0);

    async function countCategories() {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-categories`);
            setTotalCategories(response.data.result.total);
        } catch (error) {
            console.error(error);
        }
    }

    async function countTransactions() {
        const token = localStorage.getItem("accessToken");
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/all-transaction`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            });
            console.log(response);
            setTotalTransactions(response.data.result.total);
        } catch (error) {
            console.error(error);
        }
    }

    async function countSportActivities() {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-activities`);
            setTotalSportActivities(response.data.result.total);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
      countCategories();
      countTransactions();
      countSportActivities();
    }, [])
    
    return (
        <div className="p-3 pt-5 sm:p-8">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h1 className="text-2xl sm:text-[32px] font-semibold">Dashboard</h1>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-8">
                <div className="flex flex-col items-center text-center bg-base-300 bg-[url('/Pattern.png')] min-w-50 py-12 rounded-box">
                    <h1 className="text-7xl mb-3">
                        <CountUp end={totalCategories} duration={2} />
                    </h1>
                    <h4 className="">Categories</h4>
                </div>
                <div className="flex flex-col items-center text-center bg-base-300 bg-[url('/Pattern.png')] min-w-50 py-12 rounded-box">
                    <h1 className="text-7xl mb-3">
                        <CountUp end={totalTransactions} duration={2} />
                    </h1>
                    <h4 className="">Transactions</h4>
                </div>
                <div className="flex flex-col items-center text-center bg-base-300 bg-[url('/Pattern.png')] min-w-50 py-12 rounded-box">
                    <h1 className="text-7xl mb-3">
                        <CountUp end={totalSportActivities} duration={2} />
                    </h1>
                    <h4 className="">Sport Activities</h4>
                </div>
            </div>
        </div>
    )
}

export { Dashboard };