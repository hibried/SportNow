import { motion } from "framer-motion";
import { Activity, MapPin, Calendar, UserRoundCog, UsersRound } from "lucide-react";
import ActivitiesSkeletonGrid from "../../ActivitiesSkeletonGrid"

function ActivitiesShowcase({ activities, isActivityLoading, onOpenActivity }) {
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
					{isActivityLoading ? (
						// Skeleton cards
						<ActivitiesSkeletonGrid length={3} />
					) : activities.length > 0 ? (
							activities.map((a) => (
								<motion.div
									key={a.id}
									initial={{ opacity: 0, y: 12 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.45 }}
									className="card bg-base-100 border hover:shadow-xl cursor-pointer overflow-hidden"
									onClick={() => onOpenActivity(a.id)}
								>
									<figure className="h-48 overflow-hidden relative">
										<img
											src={
												a.image_url ||
												"https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80"
											}
											alt={a.title}
											className="w-full h-full object-cover"
										/>
										{/* Badge overlay on image */}
										{new Date(a.activity_date) < new Date() ? (
											<span className="absolute top-2 left-2 badge badge-error font-semibold">EXPIRED</span>
										) : new Set(a.participants?.map((p) => p.user?.id)).size >= a.slot ? (
											<span className="absolute top-2 left-2 badge badge-warning">FULL</span>
										) : null}
									</figure>

									<div className="card-body space-y-1">
										{/* Title */}
										<h3 className="card-title text-lg">{a.title}</h3>

										{/* Sport category */}
										<p className="text-xs opacity-70 flex items-center gap-2">
											<Activity className="h-4 w-4" /> {a.sport_category?.name ? a.sport_category?.name : "-"}
										</p>

										{/* City */}
										<p className="text-xs opacity-70 flex items-center gap-2">
											<MapPin className="h-4 w-4" /> {a.address}
										</p>

										{/* Date & Time */}
										<p className="text-xs opacity-70 flex items-center gap-2">
											<Calendar className="h-4 w-4" /> {new Date(a.activity_date).toLocaleDateString()}, {a.start_time.slice(0, 5)} - {a.end_time.slice(0, 5)}
										</p>

										{/* Participants / Slots */}
										<p className="text-xs opacity-70 flex items-center gap-2">
											<UsersRound className="h-4 w-4" /> {new Set(a.participants?.map((p) => p.user?.id)).size}/{a.slot} joined
										</p>

										{/* Organizer */}
										<p className="text-xs opacity-70 flex items-center gap-2">
											<UserRoundCog className="h-4 w-4" /> {a.organizer?.name}
										</p>

										{/* Price */}
										{/* <div className="card-actions justify-end mt-2">
											{a.price_discount ? (
												<div className="flex flex-col items-end">
													<span className="line-through text-xs opacity-50">
														Rp {a.price.toLocaleString()}
													</span>
													<span className="badge badge-primary px-3 py-2">
														Rp {a.price_discount.toLocaleString()}
													</span>
												</div>
											) : (
												<span className="badge badge-primary px-3 py-2 font-semibold">
													Rp {a.price.toLocaleString()}
												</span>
											)}
										</div> */}
									</div>
								</motion.div>
							))
						) : (
							<p className="col-span-full text-center opacity-70">
								No activities found
							</p>
						)
					}
				</div>
			</div>
		</section>
	);
}

export default ActivitiesShowcase;