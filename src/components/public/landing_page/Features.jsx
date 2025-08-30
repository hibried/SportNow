import { motion } from "framer-motion";
import { Activity, Dumbbell, UsersRound } from "lucide-react";

function Features({ container, item }) {
	const features = [
		{
			icon: <Dumbbell className="h-6 w-6 text-orange-500" />,
			title: "Easy Booking",
			desc: "Reserve venues in seconds with transparent pricing and instant confirmation.",
		},
		{
			icon: <UsersRound className="h-6 w-6 text-orange-500" />,
			title: "Play with Community",
			desc: "Join public games or invite friends to private matches.",
		},
		{
			icon: <Activity className="h-6 w-6 text-orange-500" />,
			title: "Variety of Sports",
			desc: "Futsal, badminton, tennis, fitness sessions — find what you love.",
		},
	];

	return (
		<section id="features" className="py-12 md:py-20">
			<div className="max-w-6xl mx-auto px-4">
				<motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
				<motion.h2 variants={item} className="text-3xl md:text-4xl font-extrabold">
					Why SportNow
				</motion.h2>
				<motion.p variants={item} className="mt-2 text-base-content/70 max-w-2xl">
					We bring players, venues, and events together — simple, fast, and community-first.
				</motion.p>

				<div className="grid md:grid-cols-3 gap-6 mt-8">
					{features.map((f, i) => (
						<motion.div
							key={i}
							variants={item}
							className="card bg-base-100 border border-base-200 shadow-sm p-5"
						>
							<div className="flex items-start gap-4">
								<div className="rounded-full bg-base-200 p-3">{f.icon}</div>
								<div>
									<h3 className="font-semibold">{f.title}</h3>
									<p className="text-sm opacity-70 mt-1">{f.desc}</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
				</motion.div>
			</div>
		</section>
	);
}

export default Features;