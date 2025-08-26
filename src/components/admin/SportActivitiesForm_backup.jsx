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
    const [isDisabled, setIsDisabled] = useState("disabled");

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

    const navigate = useNavigate();

    const [categoryMaxId, setCategoryMaxId] = useState(0);
    const [categoryMinId, setCategoryMinId] = useState(0);

    // const [doesCategoryExist, setDoesCategoryExist] = useState(false);

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
        const body = {
                sport_category_id: sportCategoryId,
                city_id: cityId,
                title: title,
                description: description,
                slot: slot,
                price: price,
                address: address,
                activity_date: activityDate,
                start_time: startTime.slice(0, 5),
                end_time: endTime.slice(0, 5),
                map_url: mapUrl,
        };
        console.log(body);
        // const loading_message = Object.keys(activity).length > 0 ? "Updating..." : "Adding...";
        // const success_message = Object.keys(activity).length > 0 ? `'s detail has been updated` : ` has been added` ;
        // const loading_toast = toast.loading(loading_message);
        // const method = id ? `update/${id}` : "create";
        // setIsLoading(true);

        // try {
        //     const response = await axios.post(`${BASE_URL}/api/v1/sport-activities/${method}`, {
        //         sport_category_id: sportCategoryId,
        //         city_id: cityId,
        //         title: title,
        //         description: description,
        //         slot: slot,
        //         price: price,
        //         address: address,
        //         activity_date: activityDate,
        //         start_time: startTime,
        //         end_time: endTime,
        //         map_url: mapUrl,
        //     }, {
        //         headers: {
        //             Authorization: `Bearer ${BEARER_TOKEN}`,
        //             Accept: 'application/json',
        //         },
        //     });
        //     // console.log(response);
        //     setTimeout(() => {
        //         navigate("/sport_activities");
        //         toast.dismiss(loading_toast);
        //         toast.success(success_message);
        //     }, 2000);
        // } catch (error) {
        //     console.error(error);
        // } finally {
        //     setIsLoading(false);
        // }
    }

    // for number input fields
    const priceHandlers = useNumberInputHandlers(setPrice);
    const slotHandlers = useNumberInputHandlers(setSlot);

    // Format today's date as YYYY-MM-DD
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 1); // require tomorrow or later
    const minDateStr = minDate.toISOString().split("T")[0];
    
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

    useEffect(() => {
        if(sportCategoryId && cityId && title && description && slot > 0 && price > 0 && address && activityDate && startTime && endTime && mapUrl){
            setIsDisabled(false);
        } else {
            setIsDisabled("disabled");
        }
    }, [sportCategoryId, cityId, title, description, slot, price, address, activityDate, startTime, endTime, mapUrl])

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
                <button onClick={onSubmit} className="btn btn-primary text-[12px] sm:text-[14px] rounded-lg btn-sm sm:btn-md" disabled={isDisabled}>{Object.keys(activity).length > 0 ? "Update Now" : "Add Now"}</button>
            </div>
            <div className="flex flex-col items-center bg-base-300 bg-[url('/Pattern.png')] min-w-66 py-12 rounded-box">
                <form className="fieldset grid gap-7 lg:gap-13">
                    <div className="grid lg:grid-cols-2 gap-7 lg:gap-13">
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Category <span className="text-red-400">*</span></legend>
                            <select
                                value={id ? (sportCategoryId >= categoryMinId && sportCategoryId <= categoryMaxId ? sportCategoryId : "") : sportCategoryId || ""}
                                onChange={(e) => setSportCategoryId(e.target.value)}
                                className="select bg-base-200 w-78 sm:w-90 focus:outline-none"
                            >
                                <option value="" disabled>Pick a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Location <span className="text-red-400">*</span></legend>
                            <div className="flex gap-1 w-78 sm:w-90">
                                <select value={selectedProvinceId} onChange={(e) => setSelectedProvinceId(e.target.value)} defaultValue="Pick a province" className="select bg-base-200 w-full focus:outline-none">
                                    <option disabled={true}>Pick a province</option>
                                    {provinces.map((province, index) => (
                                        <option key={index} value={province.province_id}>{province.province_name_id}</option>
                                    ))}
                                </select>
                                <select value={cityId} onChange={(e) => setCityId(e.target.value)} defaultValue="Pick a city" className="select bg-base-200 w-full focus:outline-none" disabled={!selectedProvinceId}>
                                    <option disabled={true}>Pick a city</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city.city_id}>{city.city_name_full}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Title <span className="text-red-400">*</span></legend>
                            <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Play soccer together" required />
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Slot <span className="text-red-400">*</span></legend>
                            <input type="text" value={slot} {...slotHandlers} inputMode="numeric" pattern="[0-9]*" className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" required />
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Price (Rp) <span className="text-red-400">*</span></legend>
                            <input type="text" value={price} {...priceHandlers} inputMode="numeric" pattern="[0-9]*" className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" required />
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Address <span className="text-red-400">*</span></legend>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Activity Date <span className="text-red-400">*</span></legend>
                            <input type="date" value={activityDate} min={minDateStr} onChange={(e) => setActivityDate(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Map URL <span className="text-red-400">*</span></legend>
                            <input type="url" value={mapUrl} onChange={(e) => setMapUrl(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. https://maps.app.goo.gl/BpnRR1hsdJKYVXB16" required />
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Start Time <span className="text-red-400">*</span></legend>
                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                        </div>
                        <div>
                            <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">End Time <span className="text-red-400">*</span></legend>
                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="input validator w-78 sm:w-90 bg-base-200 focus:outline-none" placeholder="Ex. Noldua National Stadium" required />
                        </div>
                    </div>
                    <div>
                        <legend className="block fieldset-legend text-sm text-[#adadad] mb-1">Description <span className="text-red-400">*</span></legend>
                        <textarea type="text" value={description} onChange={(e) => setDescription(e.target.value)} className="input validator w-full bg-base-200 focus:outline-none py-2" placeholder="Ex. Playing together will burn your spirit and soul!" required />
                    </div>
                </form>
            </div>
        </div>
    )
}

export { SportActivitiesForm }