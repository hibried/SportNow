import { useNavigate } from "react-router-dom";

function CTA() {
	const navigate = useNavigate();

	return (
		<section className="py-12">
			<div className="max-w-6xl mx-auto px-4">
				<div className="card p-6 bg-base-100 border border-base-200 shadow-lg">
					<div className="md:flex md:items-center md:justify-between gap-6">
						<div>
							<h3 className="text-2xl md:text-3xl font-extrabold">Ready to play?</h3>
							<p className="opacity-70">Find activities and reserve your spot in seconds.</p>
						</div>
						<div className="mt-4 md:mt-0">
							<button onClick={() => navigate("/activities")} className="btn btn-primary">Find Activities</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default CTA;