import { motion } from "framer-motion";

function Hero() {
	return (
		<section className="relative">
			{/* Fixed sports background */}
			<div
				className="bg-cover bg-center relative flex items-center"
				style={{
				backgroundImage:
					"url('https://images.pexels.com/photos/4968382/pexels-photo-4968382.jpeg?cs=srgb&dl=pexels-karolina-grabowska-4968382.jpg&fm=jpg')",
				}}
			>
				<div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-red-500 opacity-75" />
				<div className="max-w-6xl mx-auto px-4 py-16 md:py-20 relative z-10 w-full">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.7 }}
						className=""
					>
						<h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-center text-white">
							<span className="">MY TRANSACTION</span>
						</h1>
					</motion.div>
				</div>
			</div>
		</section>
	);
}

export default Hero;