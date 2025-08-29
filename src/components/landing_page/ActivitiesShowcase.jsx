import { motion } from "framer-motion";
import { Activity, MapPin } from "lucide-react";

function ActivitiesShowcase({ activities, onOpenActivity }) {
	return (
		<section id="activities" className="py-12 md:py-20">
			<div className="max-w-6xl mx-auto px-4">
				<motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl md:text-4xl font-extrabold mb-6"
				>
				    Featured Activities
				</motion.h2>

				<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{activities.length > 0 ? (
					activities.map((a) => (
						<motion.div
							key={a.id}
							initial={{ opacity: 0, y: 12 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.45 }}
							className="card bg-base-100 border hover:shadow-xl cursor-pointer overflow-hidden"
							onClick={() => onOpenActivity(a.id)}
						>
							<figure className="h-48 overflow-hidden">
                                <img
                                    src={
                                    a.image_url ||
                                    "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
                                    }
                                    alt={a.title}
                                    className="w-full h-full object-cover"
                                />
							</figure>
							<div className="card-body">
								<h3 className="card-title text-lg">{a.title}</h3>
								<p className="text-sm opacity-70 flex items-center gap-2">
									<Activity className="h-4 w-4" /> {a.sport_category?.name}
								</p>
								<p className="text-sm opacity-70 flex items-center gap-2">
									<MapPin className="h-4 w-4" /> {a.city?.city_name_full}
								</p>
								<div className="card-actions justify-end mt-2">
									<span className="badge badge-primary px-3 py-2">Rp {a.price.toLocaleString()}</span>
								</div>
							</div>
						</motion.div>
					))
				) : (
					<p className="col-span-full text-center opacity-70">No activities found</p>
				)}
				</div>
			</div>
		</section>
	);
}

export default ActivitiesShowcase;