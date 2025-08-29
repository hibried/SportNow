import { motion } from "framer-motion";
import { ArrowRight, Search, Shield } from "lucide-react";

function Hero({
	categories,
	provinces,
	cities,
	selectedCategory,
	setSelectedCategory,
	selectedProvince,
	setSelectedProvince,
	selectedCity,
	setSelectedCity,
	onSearch,
}) {
	return (
		<section className="relative">
			{/* Fixed sports background */}
			<div
				className="h-[60vh] bg-cover bg-center relative flex items-center"
				style={{
				backgroundImage:
					"url('https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80')",
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
					<div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10 w-full">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className="grid lg:grid-cols-2 gap-8 items-center"
					>
						<div className="text-white">
						<h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
							Find & Book Your Next <span className="text-orange-400">Sport Activity</span>
						</h1>
						<p className="mt-4 max-w-2xl text-lg opacity-90">
							Futsal, badminton, tennis — discover events and venues near you, reserve instantly,
							and play with your community.
						</p>

						<div className="mt-6 flex gap-3 flex-wrap">
							<a href="#activities" className="btn btn-primary rounded-full px-6">
								<ArrowRight className="h-4 w-4" /> Browse Activities
							</a>
							{/* <a href="#venues" className="btn btn-ghost rounded-full px-6">
							Become a Venue
							</a> */}
						</div>
						</div>

						{/* Search / Filters Card */}
						<div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="card bg-base-100 shadow-lg p-4"
							>
								<div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center">
									<div className="col-span-1 md:col-span-1">
										<select
											value={selectedCategory}
											onChange={(e) => setSelectedCategory(e.target.value)}
											className="select select-bordered w-full"
										>
											<option value="">All Sports</option>
											{categories.map((c) => (
												<option key={c.id} value={c.id}>
													{c.name}
												</option>
											))}
										</select>
									</div>

									<div>
										<select
											value={selectedProvince}
											onChange={(e) => setSelectedProvince(e.target.value)}
											className="select select-bordered w-full"
										>
										<option value="">All Provinces</option>
										{provinces.map((p) => (
											<option key={p.province_id} value={p.province_id}>
												{p.province_name}
											</option>
										))}
										</select>
									</div>

									<div>
										<select
											value={selectedCity}
											onChange={(e) => setSelectedCity(e.target.value)}
											className="select select-bordered w-full"
											disabled={!selectedProvince}
										>
										<option value="">All Cities</option>
										{cities.map((c) => (
											<option key={c.city_id} value={c.city_id}>
												{c.city_name_full}
											</option>
										))}
										</select>
									</div>

									<div className="flex">
										<button
											onClick={onSearch}
											className="btn btn-primary w-full flex items-center justify-center gap-2"
										>
											<Search size={16} /> Search
										</button>
									</div>
								</div>

								<div className="mt-3 text-xs opacity-70 flex items-center gap-3">
									<Shield className="h-4 w-4" />
									<span>Secure booking • Instant confirmation</span>
								</div>
							</motion.div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default Hero;