"use client";

import Image from "next/image";
import * as React from "react";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

export default function HomeCarousel() {
	const slides = ["/img/Registro.png", "/img/oferta.png"];

	React.useEffect(() => {
		const interval = setInterval(() => {
			const nextButton = document.querySelector(
				"[data-carousel-next]"
			) as HTMLElement;
			nextButton?.click();
		}, 3500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="w-full max-w-[1300px] mx-auto px-6 mt-12">
			<Carousel opts={{ align: "start", loop: true }}>
				<CarouselContent>
					{slides.map((src, index) => (
						<CarouselItem key={index}>
							<div className="relative w-full h-[160px] sm:h-[240px] md:h-[300px] lg:h-[360px] overflow-hidden rounded-xl">
								<Image
									src={src}
									alt={`Slide ${index + 1}`}
									fill
									className="object-cover"
									priority={index === 0}
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious
					data-carousel-prev
					className="hidden sm:flex left-4 bg-white/70 hover:bg-white"
				/>
				<CarouselNext
					data-carousel-next
					className="hidden sm:flex right-4 bg-white/70 hover:bg-white"
				/>
			</Carousel>
		</div>
	);
}
