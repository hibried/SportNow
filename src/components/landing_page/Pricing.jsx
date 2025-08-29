import { CheckCircle2 } from "lucide-react";

function Pricing() {
	const tiers = [
		{
			name: "Browse",
			price: "Free",
			features: ["Browse activities", "View venues", "Save favorites"],
			cta: "Start Browsing",
			highlight: false,
		},
		{
			name: "Player Plus",
			price: "Rp 29k / mo",
			features: ["Priority bookings", "Discounted rates", "Priority support"],
			cta: "Subscribe",
			highlight: true,
		},
		{
			name: "Venue Partner",
			price: "Custom",
			features: ["List your venue", "Advanced scheduling", "Business support"],
			cta: "Contact Sales",
			highlight: false,
		},
	];

	return (
		<section className="py-12 md:py-20">
			<div className="max-w-6xl mx-auto px-4">
				<h2 className="text-3xl font-extrabold mb-4">Pricing</h2>
				<p className="text-base-content/70 max-w-2xl mb-6">Plans tailored for players and venue owners.</p>

				<div className="grid md:grid-cols-3 gap-6">
					{tiers.map((t) => (
						<div
							key={t.name}
							className={`card p-6 border ${t.highlight ? "border-primary shadow-xl" : "border-base-200 shadow-sm"}`}
						>
							<h3 className="text-xl font-bold">{t.name}</h3>
							<div className="text-3xl font-extrabold my-3">{t.price}</div>
							<ul className="space-y-2 text-sm">
								{t.features.map((f) => (
									<li key={f} className="flex items-center gap-2">
										<CheckCircle2 className="h-4 w-4" /> {f}
									</li>
								))}
							</ul>
							<div className="mt-6">
								<button className={`btn ${t.highlight ? "btn-primary" : "btn-outline"}`}>{t.cta}</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Pricing;