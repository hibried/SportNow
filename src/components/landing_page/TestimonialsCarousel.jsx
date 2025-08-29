import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function TestimonialsCarousel() {
	const testimonials = [
		{
			name: "Andi Pratama",
			role: "Basketball Player",
			text: "SportNow helped me find regular pickup games — super easy and reliable.",
		},
		{
			name: "Sarah Wijaya",
			role: "Runner",
			text: "Booked a track session near my house in minutes. Highly recommended!",
		},
		{
			name: "Michael Tan",
			role: "Badminton Enthusiast",
			text: "Great prices and clear info about venues. I use it every week.",
		},
	];

	const [idx, setIdx] = useState(0);

	useEffect(() => {
		const t = setInterval(() => setIdx((p) => (p + 1) % testimonials.length), 5000);
		return () => clearInterval(t);
	}, [testimonials.length]);

	return (
		<section className="py-12 bg-base-200">
			<div className="max-w-4xl mx-auto px-4 text-center">
				<h2 className="text-2xl font-bold mb-6">What players say</h2>

				<div className="relative">
					<AnimatePresence initial={false} mode="wait">
						<motion.div
							key={idx}
							initial={{ opacity: 0, x: 40 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -40 }}
							transition={{ duration: 0.6 }}
							className="card bg-base-100 shadow-lg p-8"
						>
							<p className="italic text-lg">&quot;{testimonials[idx].text}&quot;</p>
							<div className="mt-4">
								<div className="font-semibold">{testimonials[idx].name}</div>
								<div className="text-sm opacity-70">{testimonials[idx].role}</div>
							</div>
						</motion.div>
					</AnimatePresence>

					<div className="flex justify-center mt-4 gap-2">
						{testimonials.map((_, i) => (
							<button
								key={i}
								onClick={() => setIdx(i)}
								className={`w-3 h-3 rounded-full ${i === idx ? "bg-orange-400" : "bg-gray-300"}`}
								aria-label={`Go to testimonial ${i + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default TestimonialsCarousel;