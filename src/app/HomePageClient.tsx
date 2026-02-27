"use client";

import { useEffect, useRef, useState } from "react";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import CategorySelector from "@/src/components/categorySelector";
import HomeCarousel from "@/src/components/bannerCarousel";
import Hero from "@/src/components/hero";
import CategoryCard from "@/src/components/products/categoryCard";
import ProductCarousel from "@/src/components/products/carousel";
import ProductsSection from "@/src/components/products/productsSection";
import type { Product } from "@/src/types/product";

export default function HomePageClient({
	initialProducts,
}: {
	initialProducts: Product[];
}) {
	const [selectedCategory, setSelectedCategory] = useState<
		"secos" | "humedos" | "especiales" | null
	>(null);

	const productsRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (selectedCategory && productsRef.current) {
			productsRef.current.scrollIntoView({
				behavior: "smooth",
				block: "start",
			});
		}
	}, [selectedCategory]);

	return (
		<div className="text-center pt-12">
			<Hero />
			<CategorySelector />

			<HomeCarousel />
			<ProductCarousel initialProducts={initialProducts} />

			<h1 className="text-1xl md:text-2xl lg:text-3xl font-extrabold text-[#000000] text-left max-w-[1300px] mx-auto mt-16 px-6">
				Filtrar por categoría
			</h1>

			<section className="px-6 py-16 max-w-[1300px] mx-auto">
				<div className="block sm:hidden">
					<Carousel className="w-full max-w-sm mx-auto relative">
						<CarouselContent className="-ml-1 snap-x snap-mandatory">
							<CarouselItem className="basis-full flex justify-center snap-center">
								<div className="scale-[1.1]">
									<CategoryCard
										title="ALIMENTOS SECOS"
										image="/img/Gato.png"
										count={84}
										isActive={selectedCategory === "secos"}
										onClick={() =>
											setSelectedCategory((prev) =>
												prev === "secos" ? null : "secos"
											)
										}
									/>
								</div>
							</CarouselItem>
							<CarouselItem className="basis-full flex justify-center snap-center">
								<div className="scale-[1.1]">
									<CategoryCard
										title="ALIMENTOS HUMEDOS"
										image="/img/Beagle.png"
										count={16}
										isActive={selectedCategory === "humedos"}
										onClick={() =>
											setSelectedCategory((prev) =>
												prev === "humedos" ? null : "humedos"
											)
										}
									/>
								</div>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20" />
						<CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20" />
					</Carousel>
				</div>

				<div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
					<CategoryCard
						title="ALIMENTOS SECOS"
						image="/img/img1.png"
						count={84}
						isActive={selectedCategory === "secos"}
						onClick={() =>
							setSelectedCategory((prev) =>
								prev === "secos" ? null : "secos"
							)
						}
					/>
					<CategoryCard
						title="ALIMENTOS HUMEDOS"
						image="/img/img2.png"
						count={16}
						isActive={selectedCategory === "humedos"}
						onClick={() =>
							setSelectedCategory((prev) =>
								prev === "humedos" ? null : "humedos"
							)
						}
					/>
					<CategoryCard
						title="ALIMENTOS ESPECIALES"
						image="/img/img3.png"
						count={42}
						isActive={selectedCategory === "especiales"}
						onClick={() =>
							setSelectedCategory((prev) =>
								prev === "especiales" ? null : "especiales"
							)
						}
					/>
				</div>
			</section>

			<div ref={productsRef}>
				<ProductsSection
					categoryFilter={selectedCategory}
					initialProducts={initialProducts}
				/>
			</div>
		</div>
	);
}
