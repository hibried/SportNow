import { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  User,
  Ticket,
  Loader2,
  CheckCircle,
} from "lucide-react";

export default function ActivityDetail({ activity, onJoin, currentUser }) {
  const [isJoining, setIsJoining] = useState(false);
  const [isJoined, setIsJoined] = useState(false);
  const [participants, setParticipants] = useState(activity.participants || []);

  const fullAddress = `${activity.address}, ${activity.city?.city_name_full}, ${activity.city?.province?.province_name}`;
  const mapQuery = encodeURIComponent(fullAddress);

  const isFull = participants.length >= activity.slot;
  const isPastEvent = new Date(activity.activity_date) < new Date();

  const canJoin =
    !isFull && !isPastEvent && !isJoining && !isJoined;

  const handleJoin = async () => {
    if (!canJoin) return;
    setIsJoining(true);
    try {
      await onJoin?.(activity.id); // Call parent join function

      // Instantly add current user to participants list
      setParticipants((prev) => [
        ...prev,
        {
          id: Date.now(), // temporary ID
          user: {
            name: currentUser?.name,
            email: currentUser?.email,
          },
        },
      ]);

      // Show joined success state
      setIsJoined(true);
      setTimeout(() => {
        setIsJoined(false);
      }, 2000);
    } catch (error) {
      console.error("Join failed:", error);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div className="bg-base-200 min-h-screen">
      {/* Hero Section */}
      <div
        className="relative h-64 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1599058918144-2a3d92fc9c49?auto=format&fit=crop&w=1200&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90 flex items-end p-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              {activity.title}
            </h1>
            <p className="text-gray-300 mt-1">
              {activity.sport_category?.name} •{" "}
              {activity.city?.city_name_full},{" "}
              {activity.city?.province?.province_name}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Price & Slots */}
        <div className="bg-base-100 p-6 rounded-2xl shadow-lg flex justify-between items-center border-t-4 border-primary">
          <div className="flex items-center space-x-3">
            <Ticket className="text-primary" />
            <div>
              <p className="text-lg font-semibold">
                Rp {activity.price.toLocaleString()}
              </p>
              {activity.price_discount && (
                <p className="text-sm text-success">
                  Discount: Rp {activity.price_discount.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="text-secondary" />
            <p className="font-medium">
              {participants.length} / {activity.slot} slots
            </p>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-base-100 p-4 rounded-xl shadow flex items-center space-x-3 border-t-4 border-primary">
            <Calendar className="text-primary" />
            <div>
              <p className="font-semibold">Date</p>
              <p>{activity.activity_date}</p>
            </div>
          </div>
          <div className="bg-base-100 p-4 rounded-xl shadow flex items-center space-x-3 border-t-4 border-primary">
            <Clock className="text-primary" />
            <div>
              <p className="font-semibold">Time</p>
              <p>
                {activity.start_time} - {activity.end_time}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-base-100 p-4 rounded-xl shadow flex flex-col space-y-3 border-t-4 border-primary">
          <div className="flex items-center space-x-3">
            <MapPin className="text-primary" />
            <div>
              <p className="font-semibold">Address</p>
              <p>{fullAddress}</p>
            </div>
          </div>
          <iframe
            title="Activity Location"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="w-full h-64 rounded-xl border-0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-sm"
          >
            View on Google Maps
          </a>
        </div>

        {/* Organizer */}
        <div className="bg-base-100 p-4 rounded-xl shadow flex items-center space-x-3 border-t-4 border-primary">
          <User className="text-primary" />
          <div>
            <p className="font-semibold">Organizer</p>
            <p>{activity.organizer?.name}</p>
            <p className="text-sm text-gray-500">{activity.organizer?.email}</p>
          </div>
        </div>

        {/* Participants */}
        <div className="bg-base-100 p-4 rounded-xl shadow border-t-4 border-primary">
          <p className="font-semibold mb-2">Participants</p>
          {participants.length > 0 ? (
            <ul className="list-disc list-inside space-y-1">
              {participants.map((p) => (
                <li key={p.id}>
                  {p.user?.name} ({p.user?.email})
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No participants yet</p>
          )}
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            className={`btn btn-lg rounded-full flex items-center gap-2 transition-all ${
              isJoined
                ? "bg-green-500 hover:bg-green-600 text-white"
                : "btn-primary"
            }`}
            disabled={!canJoin}
            onClick={handleJoin}
          >
            {isJoining && <Loader2 className="animate-spin" size={20} />}
            {isJoined && <CheckCircle size={20} />}
            {isFull
              ? "Full"
              : isPastEvent
              ? "Event Ended"
              : isJoined
              ? "Joined!"
              : isJoining
              ? "Joining..."
              : "Join Activity"}
          </button>
        </div>
      </div>
    </div>
  );
}
