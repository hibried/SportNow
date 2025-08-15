import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ActivityDetail from "../components/ActivityDetail";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

export default function DetailPage() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

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

    async function fetchCurrentUser() {
        // Fetch current user
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/me`, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    Accept: "application/json",
                },
            });
            console.log(response.data.data);
            setCurrentUser(response.data.data);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchActivityDetail();
        fetchCurrentUser();
    }, []);

    const handleJoin = async (id) => {
        // Call backend to join the activity
        try {
            // await axios.post(`${BASE_URL}/api/v1/activities/${id}/join`);
            console.log("JOIN SUKCESS");
        } catch (error) {
            console.error(error);
        }
        // Optionally refetch or let ActivityDetail update participants itself
    };

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
            onJoin={handleJoin}
            currentUser={currentUser}
        />
    );
}
