"use client";

import Autoplay from "embla-carousel-autoplay";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";

import ProductCard from "./ProductCard";
import { useEffect, useState } from "react";
import { getProducts } from "@/lib/products";
import type { Product } from "@/src/types/product";

export default function ProductCarousel() {
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		getProducts().then(setProducts);
	}, []);

	return (
		<section className="max-w-[1300px] mx-auto px-6 py-16 ">
			<h2 className="text-left text-3xl md:text-4xl font-bold text-[#000000] mb-10">
				Lo Más Vendido
			</h2>

			<Carousel
				opts={{ loop: true }}
				plugins={[
					Autoplay({
						delay: 2500,
						stopOnMouseEnter: true,
						stopOnInteraction: false,
					}),
				]}
				className="relative">
				<CarouselContent className="gap-6 cursor-grab active:cursor-grabbing">
					{products.map((product) => (
						<CarouselItem
							key={product.id}
							className="basis-3/4 sm:basis-1/2 lg:basis-1/3">
							{/* ✔️ Ahora ProductCard recibe el objeto completo */}
							<ProductCard product={product} variant="carousel" />
						</CarouselItem>
					))}
				</CarouselContent>

				<CarouselPrevious className="absolute -left-14 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#F32947]" />
				<CarouselNext className="absolute -right-14 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#F32947]" />
			</Carousel>
		</section>
	);
}
