"use client";

import { useState, useEffect } from "react";

const businessTypes = ["Schools", "Bookstores", "Training Centers"];

export function DynamicHeadline() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAnimating, setIsAnimating] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			setIsAnimating(true);
			setTimeout(() => {
				setCurrentIndex((prev) => (prev + 1) % businessTypes.length);
				setIsAnimating(false);
			}, 300);
		}, 3000);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="mb-8">
			<h1 className="text-left font-bold leading-tight tracking-tight">
				<span className="block text-foreground text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
					Grow your business with Sovoli technologies.
				</span>
				<span className="block text-foreground/80 text-2xl sm:text-3xl md:text-5xl lg:text-5xl mt-2">
					Built for{" "}
					<span className="relative inline-block overflow-hidden align-bottom">
						{/* Hidden longest word to set width */}
						<span className="invisible">Wellness Businesses.</span>
						{businessTypes.map((type, index) => (
							<span
								key={type}
								className={`absolute left-0 top-0 whitespace-nowrap bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent transition-all duration-500 ease-out ${
									index === currentIndex
										? isAnimating
											? "-translate-y-full opacity-0"
											: "translate-y-0 opacity-100"
										: "translate-y-full opacity-0"
								}`}
							>
								{type}.
							</span>
						))}
					</span>
				</span>
			</h1>
		</div>
	);
}
