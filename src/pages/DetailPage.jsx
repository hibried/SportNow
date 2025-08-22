import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActivityDetail from "../components/ActivityDetail";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

export default function DetailPage() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);

    async function fetchActivityDetail() {
        // Fetch activity detail
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-activities/${id}`, {
                headers: {
                    'Authorization': `Bearer ${BEARER_TOKEN}`,
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                },
            });
            console.log(response.data.result);
            setActivity(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchActivityDetail();
    }, []);

    if (!activity) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    return (
        <ActivityDetail
            activity={activity}
        />
    );
}
