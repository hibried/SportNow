import { useNumberInputHandlers } from "./NumberInputHandlers";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

const BASE_URL = "https://sport-reservation-api-bootcamp.do.dibimbing.id";
const BEARER_TOKEN = localStorage.getItem("accessToken"); // from Postman collection

function SportActivitiesForm() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false); // for buttons
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [selectedProvinceId, setSelectedProvinceId] = useState("");
    const [categories, setCategories] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);

    const [activity, setActivity] = useState({}); // sport activity
    const [sportCategoryId, setSportCategoryId] = useState("");
    const [cityId, setCityId] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [slot, setSlot] = useState(0);
    const [price, setPrice] = useState(0);
    const [address, setAddress] = useState(0);
    const [activityDate, setActivityDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [mapUrl, setMapUrl] = useState("");

    const [categoryMaxId, setCategoryMaxId] = useState(0);
    const [categoryMinId, setCategoryMinId] = useState(0);

    // Slot must be >1
    const slotPattern = /^[2-9]\d*$|^1\d\d*$/;
    // Price >=10000
    const pricePattern = /^([2-9]\d{4,}|[1-9]\d{5,})$/;
    // Simple URL validation
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$/;

    const [isValid, setIsValid] = useState(false);

    const navigate = useNavigate();

    async function getCategories() {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-categories?is_paginate=false`);
            const data = response.data.result;
            setCategories(data);
            setCategoryMaxId(Math.max(...data.map(item => item.id)));
            setCategoryMinId(Math.min(...data.map(item => item.id)));
        } catch (error) {
            console.error(error);
        }
    }

    async function getProvinces() {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/location/provinces?is_paginate=false`);
            setProvinces(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    async function getCitiesByProvinceId(id) {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/location/cities/${id}?is_paginate=false`);
            setCities(response.data.result);
        } catch (error) {
            console.error(error);
        }
    }

    async function getSportActivity() {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/sport-activities/${id}`);
            setActivity(response.data.result);
        } catch (error) {
            console.error(error);
        } finally {
            setIsPageLoading(false);
        }
    }

    // function onSubmit() {
    //     const loading_message = Object.keys(activity).length > 0 ? "Updating..." : "Adding...";
    //     const success_message = Object.keys(activity).length > 0 ? `'s detail has been updated` : ` has been added` ;

    //     const loading_toast = toast.loading(loading_message);
    //     setTimeout(() => {
    //         navigate("/sport_activities");
    //         toast.dismiss(loading_toast);
    //         toast.success(success_message);
    //     }, 2000);
    // }

    async function onSubmit() {
        setIsLoading(true);
        const body = {
            sport_category_id: Number(sportCategoryId),
            city_id: Number(cityId),
            title: title,
            description: description,
            slot: Number(slot),
            price: Number(price),
            address: address,
            activity_date: activityDate,
            start_time: startTime.slice(0, 5),
            end_time: endTime.slice(0, 5),
            map_url: mapUrl,
        };
        console.log(body);

        const loading_message = Object.keys(activity).length > 0 ? "Updating..." : "Adding...";
        const success_message = Object.keys(activity).length > 0 ? `[ID_${id}] Activity has been updated` : `Activity has been added` ;
        const loading_toast = toast.loading(loading_message);
        const method = id ? `update/${id}` : "create";

        try {
            const response = await axios.post(`${BASE_URL}/api/v1/sport-activities/${method}`, body, {
                headers: {
                    Authorization: `Bearer ${BEARER_TOKEN}`,
                    Accept: 'application/json',
                },
            });
            console.log(response);
            setTimeout(() => {
                navigate("/sport_activities");
                toast.dismiss(loading_toast);
                toast.success(success_message);
                setIsLoading(false);
            }, 2000);
        } catch (error) {
            console.error(error.response.data.message);
            toast.dismiss(loading_toast);
            toast.error(error.response.data.message);
            setIsLoading(false);
        }
    }

    // for number input fields
    const priceHandlers = useNumberInputHandlers(setPrice);
    const slotHandlers = useNumberInputHandlers(setSlot);

    // Format today's date as YYYY-MM-DD
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1); // require tomorrow or later
    const minDateStr = minDate.toISOString().split("T")[0];

    // Convert "HH:MM" -> total minutes since midnight
    function toMinutes(time) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
    }

    // Convert total minutes -> "HH:MM" (wrap around 24h)
    function toHHMM(totalMinutes) {
        const dayMinutes = (totalMinutes + 24 * 60) % (24 * 60);
        const h = Math.floor(dayMinutes / 60);
        const m = dayMinutes % 60;
        return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
    }

    const minEndTime = startTime ? toHHMM(toMinutes(startTime) + 120) : "";
    const maxStartTime = endTime ? toHHMM(toMinutes(endTime) - 120) : "";

    const setDummy = () => {
        setSelectedProvinceId(31);

        setSportCategoryId(159);
        setCityId(3172);
        setTitle("Play soccer together");
        setDescription("Playing together will burn your spirit and soul!");
        setSlot("22");
        setPrice("150000");
        setAddress("Noldua National Stadium");
        setActivityDate("2025-11-01");
        setStartTime("10:00");
        setEndTime("12:00");
        setMapUrl("https://maps.app.goo.gl/BpnRR1hsdJKYVXB16");
    }
    
    useEffect(() => {
        getCategories();
        getProvinces();
    }, [])

    useEffect(() => {
        if(selectedProvinceId){
            getCitiesByProvinceId(selectedProvinceId);
        }
    }, [selectedProvinceId])

    useEffect(() => {
        if(categories.length > 0 && provinces.length > 0){
            if(id){
                getSportActivity();
            } else {
                setIsPageLoading(false);
            }
        }
    }, [categories, provinces])

    useEffect(() => {
        setSelectedProvinceId(activity.city?.province?.province_id);
        
        setSportCategoryId(activity.sport_category_id);
        setCityId(activity.city_id);
        setTitle(activity.title || "");
        setDescription(activity.description || "");
        setSlot(String(activity.slot || 0));
        setPrice(String(activity.price || 0));
        setAddress(activity.address || "")
        setActivityDate(activity.activity_date || "");
        setStartTime(activity.start_time || "");
        setEndTime(activity.end_time || "");
        setMapUrl(activity.map_url || "");
    }, [activity])

    const doesSelectedCategoryExist = sportCategoryId >= categoryMinId && sportCategoryId <= categoryMaxId;

    useEffect(() => {
        // Convert times to minutes
        const startMinutes = startTime ? toMinutes(startTime) : null;
        const endMinutes = endTime ? toMinutes(endTime) : null;

        // Check time constraints: start must be max 2 hours before end, end min 2 hours after start
        const timeValid =
            startMinutes !== null &&
            endMinutes !== null &&
            endMinutes - startMinutes >= 120;

        // Check activity date is tomorrow or later
        const dateValid = activityDate >= minDateStr;

        // Check all validations
        const valid =
            doesSelectedCategoryExist &&
            selectedProvinceId &&
            cityId &&
            title.trim() !== "" &&
            slotPattern.test(slot) &&
            slot >= 2 &&
            pricePattern.test(price) &&
            price >= 20000 &&
            address.trim() !== "" &&
            urlPattern.test(mapUrl) &&
            startTime !== "" &&
            endTime !== "" &&
            timeValid &&
            dateValid &&
            description.trim() !== "";

        setIsValid(valid);
    }, [
        sportCategoryId,
        selectedProvinceId,
        cityId,
        title,
        slot,
        price,
        address,
        activityDate,
        mapUrl,
        startTime,
        endTime,
        description,
    ]);

    if(isPageLoading) {
        return (
            <div className="flex items-center justify-center h-screen gap-2">
                <span className="loading loading-bars loading-xl"></span>
            </div>
        )
    }

    return (
        <div className="p-3 pt-5 sm:p-8">
            <div className="flex justify-between items-center mb-3 sm:mb-6">
                <h1 className="text-2xl sm:text-[32px] font-semibold">{Object.keys(activity).length > 0 ? (activity.title + "'s Detail") : "Add Sport Activity"}</h1>
                <button onClick={setDummy} className="btn btn-primary text-[12px] sm:text-[14px] rounded-lg btn-sm sm:btn-md">Set Dummy</button>
                <button onClick={onSubmit} className="btn btn-primary text-[12px] sm:text-[14px] rounded-lg btn-sm sm:btn-md" disabled={!isValid || isLoading}>{Object.keys(activity).length > 0 ? "Update Now" : "Add Now"}</button>
            </div>
            <div className="flex flex-col items-center bg-base-300 bg-[url('/Pattern.png')] min-w-66 py-12 rounded-box">
                <form className="grid gap-7 lg:gap-13">
                    <div className="grid lg:grid-cols-2 gap-7 lg:gap-13">
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Category <span className="text-red-400">*</span></legend>
                            <select
                                value={doesSelectedCategoryExist ? sportCategoryId : ""}
                                onChange={(e) => setSportCategoryId(e.target.value)}
                                className="select validator bg-base-200 w-78 sm:w-90 focus:outline-none"
                            >
                                <option value="" disabled>Pick a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                            <p className="label">
                                <span className={`label-text-alt ${doesSelectedCategoryExist ? "text-green-500" : "text-red-500"}`}>
                                    {doesSelectedCategoryExist ? "Looks good!" : "Please select a valid category."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Location <span className="text-red-400">*</span></legend>
                            <div className="flex gap-1 w-78 sm:w-90">
                                <select value={selectedProvinceId} onChange={(e) => setSelectedProvinceId(e.target.value)} defaultValue="Pick a province" className="select validator bg-base-200 w-full focus:outline-none">
                                    <option disabled={true}>Pick a province</option>
                                    {provinces.map((province, index) => (
                                        <option key={index} value={province.province_id}>{province.province_name_id}</option>
                                    ))}
                                </select>
                                <select value={cityId} onChange={(e) => setCityId(e.target.value)} defaultValue="Pick a city" className="select validator bg-base-200 w-full focus:outline-none" disabled={!selectedProvinceId}>
                                    <option disabled={true}>Pick a city</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city.city_id}>{city.city_name_full}</option>
                                    ))}
                                </select>
                            </div>
                            <p className="label">
                                <span className={`label-text-alt ${selectedProvinceId && cityId ? "text-green-500" : "text-red-500"}`}>
                                    {selectedProvinceId && cityId ? "Looks good!" : "Please select a valid location."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Title <span className="text-red-400">*</span></legend>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Play soccer together" required />
                            <p className="label">
                                <span className={`label-text-alt ${title.trim() !== "" ? "text-green-500" : "text-red-500"}`}>
                                    {title.trim() !== "" ? "Looks good!" : "Title cannot be empty."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Slot <span className="text-red-400">*</span></legend>
                            <input type="text" title="Slot must be filled by at least 2 people." value={slot} {...slotHandlers} inputMode="numeric" pattern="^[2-9]\d*$|^1\d\d*$" min="2" className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" required />
                            <p className="label">
                                <span className={`label-text-alt ${slotPattern.test(slot) && slot >= 2 ? "text-green-500" : "text-red-500"}`}>
                                    {slotPattern.test(slot) && slot >= 2 ? "Looks good!" : "Slot must be filled by at least 2 people."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Price (Rp) <span className="text-red-400">*</span></legend>
                            <input type="text" title="Price must be above or equal to Rp20000." value={price} {...priceHandlers} inputMode="numeric" pattern="^([2-9]\d{4,}|[1-9]\d{5,})$" className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" required />
                            <p className="label">
                                <span className={`label-text-alt ${pricePattern.test(price) && price >= 20000 ? "text-green-500" : "text-red-500"}`}>
                                    {pricePattern.test(price) && price >= 20000 ? "Looks good!" : "Price must be above or equal to Rp20000."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Address <span className="text-red-400">*</span></legend>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                            <p className="label">
                                <span className={`label-text-alt ${address.trim() !== "" ? "text-green-500" : "text-red-500"}`}>
                                    {address.trim() !== "" ? "Looks good!" : "Address cannot be empty."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Activity Date <span className="text-red-400">*</span></legend>
                            <input type="date" value={activityDate} min={minDateStr} onChange={(e) => setActivityDate(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                            <p className="label">
                                <span className={`label-text-alt ${activityDate >= minDateStr ? "text-green-500" : "text-red-500"}`}>
                                    {activityDate >= minDateStr ? "Looks good!" : "Activity date must be tomorrow or later."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Map URL <span className="text-red-400">*</span></legend>
                            <input type="url" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} pattern="^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9\-].*[a-zA-Z0-9])?\.)+[a-zA-Z].*$" className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. https://maps.app.goo.gl/BpnRR1hsdJKYVXB16" required />
                            <p className="label">
                                <span className={`label-text-alt ${urlPattern.test(mapUrl) ? "text-green-500" : "text-red-500"}`}>
                                    {urlPattern.test(mapUrl) ? "Looks good!" : "Please enter a valid URL."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">Start Time <span className="text-red-400">*</span></legend>
                            <input type="time" value={startTime} max={maxStartTime} onChange={(e) => setStartTime(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                            <p className="label">
                                <span className={`label-text-alt ${startTime !== "" ? (endTime !== "" ? (toMinutes(endTime) - toMinutes(startTime) >= 120 ? "text-green-500" : "text-red-500") : "text-green-500") : "text-red-500"}`}>
                                    {startTime !== "" ? (endTime !== "" ? (toMinutes(endTime) - toMinutes(startTime) >= 120 ? "Looks good!" : "Start time must be at least 2 hours before end time.") : "Looks good!") : "Please select a start time."}
                                </span>
                            </p>
                        </div>
                        <div className="fieldset">
                            <legend className="block fieldset-legend text-sm text-[#adadad]">End Time <span className="text-red-400">*</span></legend>
                            <input type="time" value={endTime} min={minEndTime} onChange={(e) => setEndTime(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                            <p className="label">
                                <span className={`label-text-alt ${endTime !== "" ? (startTime !== "" ? (toMinutes(endTime) - toMinutes(startTime) >= 120 ? "text-green-500" : "text-red-500") : "text-green-500") : "text-red-500"}`}>
                                    {endTime !== "" ? (startTime !== "" ? (toMinutes(endTime) - toMinutes(startTime) >= 120 ? "Looks good!" : "End time must be at least 2 hours after start time.") : "Looks good!") : "Please select an end time."}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="fieldset">
                        <legend className="block fieldset-legend text-sm text-[#adadad]">Description <span className="text-red-400">*</span></legend>
                        <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input validator w-full bg-base-200 focus:outline-none py-2" placeholder="Ex. Playing together will burn your spirit and soul!" required />
                        <p className="label">
                            <span className={`label-text-alt ${description.trim() !== "" ? "text-green-500" : "text-red-500"}`}>
                                {description.trim() !== "" ? "Looks good!" : "Description cannot be empty."}
                            </span>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export { SportActivitiesForm }