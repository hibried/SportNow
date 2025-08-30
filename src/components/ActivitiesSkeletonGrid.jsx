import { motion } from "framer-motion";

const ActivitySkeleton = () => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="card bg-base-100 border overflow-hidden"
    >
        {/* Image skeleton */}
        <figure className="h-48 w-full overflow-hidden relative">
            <div className="skeleton w-full h-full" />
            {/* badge placeholder */}
            <span className="absolute top-2 left-2 skeleton h-6 w-14 rounded-lg" />
        </figure>

        <div className="card-body space-y-1">
            {/* Title */}
            <div className="skeleton h-5 w-3/4" />

            {/* Sport category */}
            <div className="flex items-center gap-2">
                <div className="skeleton h-4 w-4 rounded" />
                <div className="skeleton h-4 w-24" />
            </div>

            {/* Address */}
            <div className="flex items-center gap-2">
                <div className="skeleton h-4 w-4 rounded" />
                <div className="skeleton h-4 w-40" />
            </div>

            {/* Date & Time */}
            <div className="flex items-center gap-2">
                <div className="skeleton h-4 w-4 rounded" />
                <div className="skeleton h-4 w-32" />
            </div>

            {/* Participants */}
            <div className="flex items-center gap-2">
                <div className="skeleton h-4 w-4 rounded" />
                <div className="skeleton h-4 w-24" />
            </div>

            {/* Organizer */}
            <div className="flex items-center gap-2">
                <div className="skeleton h-4 w-4 rounded" />
                <div className="skeleton h-4 w-20" />
            </div>

            {/* Price */}
            {/* <div className="card-actions justify-end mt-2">
                <div className="skeleton h-6 w-24 rounded-lg" />
            </div> */}
        </div>
    </motion.div>
);

export default function ActivitiesSkeletonGrid({ length = 3 }) {
    return (
        <>
            {Array.from({ length: length }).map((_, i) => (
                <ActivitySkeleton key={i} />
            ))}
        </>
    );
}