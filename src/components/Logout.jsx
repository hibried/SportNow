import { toast } from "sonner";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";

async function Logout(navigate) {
    try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.post(`${BASE_URL}/api/v1/logout`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });

        if (response.status === 200) {
            localStorage.clear();
            const loading_toast = toast.loading("Logging out...");

            // return a promise that resolves after setTimeout
            return new Promise((resolve) => {
                setTimeout(() => {
                    navigate("/");
                    toast.dismiss(loading_toast);
                    toast.success("Successfully logged out");
                    resolve(); // ✅ signals "finished"
                }, 2000);
            });
        }
    } catch (error) {
        console.error(error);
    }
}

export { Logout };
