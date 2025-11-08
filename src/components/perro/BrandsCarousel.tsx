"use client";

import Image from "next/image";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

const brands = [
	{ name: "Royal Canin", image: "/img/RoyalCanin.png" },
	{ name: "Advance", image: "/img/Advance.png" },
	{ name: "Purina", image: "/img/Purina.png" },
	{ name: "Vitalcan", image: "/img/VitalCan.png" },
];

export default function BrandsCarousel() {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-14">
			<h2 className="text-[22px] sm:text-[28px] font-extrabold mb-8">
				MARCAS POPULARES
			</h2>

			<Carousel
				opts={{
					align: "start",
					loop: true,
				}}
				className="relative">
				<CarouselContent className="-ml-3">
					{brands.map((brand, index) => (
						<CarouselItem
							key={index}
							className="pl-3 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
							<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 flex items-center justify-center h-[90px] border border-gray-200">
								<div className="relative w-32 h-12">
									<Image
										src={brand.image}
										alt={brand.name}
										fill
										className="object-contain"
									/>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious className="text-[#F32947] border-[#F32947]" />
				<CarouselNext className="text-[#F32947] border-[#F32947]" />
			</Carousel>
		</section>
	);
}
