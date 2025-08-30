function FAQ() {
	const qa = [
		{ q: "How do I book an activity?", a: "Select a sport, choose a venue, pick a time, and confirm your booking. Payment is handled during checkout." },
		{ q: "Can I cancel my reservation?", a: "Yes — cancellations depend on the venue's policy. You'll see the cancellation terms before confirming." },
		{ q: "What payment methods are supported?", a: "We accept common local payment methods supported by the venue: bank transfer, card, and e-wallets." },
	];

	return (
		<section id="faq" className="py-12 bg-base-200/60">
			<div className="max-w-5xl mx-auto px-4">
				<h2 className="text-3xl md:text-4xl font-extrabold mb-6">FAQ</h2>

				<div className="join join-vertical w-full">
					{qa.map((row, idx) => (
						<div key={idx} className="collapse collapse-arrow join-item bg-base-100 border border-base-200">
							<input type="radio" name="faq" defaultChecked={idx === 0} />
							<div className="collapse-title text-base font-medium">{row.q}</div>
							<div className="collapse-content text-sm opacity-80">
								<p>{row.a}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default FAQ;