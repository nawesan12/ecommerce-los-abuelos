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

const products = [
	{ title: "Dog Chow Adultos", price: 8990, image: "/img/11.png" },
	{ title: "Whiskas Mix", price: 5490, image: "/img/11.png" },
	{ title: "Shampoo Neutro", price: 3200, image: "/img/11.png" },
	{ title: "Juguete de Cuerda", price: 1800, image: "/img/11.png" },
];

export default function ProductCarousel() {
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
					{products.map((product, index) => {
						const id = index + 1;
						return (
							<CarouselItem
								key={id}
								className="basis-3/4 sm:basis-1/2 lg:basis-1/3">
								<ProductCard
									id={`${id}`}
									title={product.title}
									image={product.image}
									price={product.price}
									href={`/producto/${id}`} // ← AHORA SIEMPRE TIENE HREF
									variant="carousel"
								/>
							</CarouselItem>
						);
					})}
				</CarouselContent>

				<CarouselPrevious className="absolute -left-14 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#F32947]" />
				<CarouselNext className="absolute -right-14 top-1/2 -translate-y-1/2 bg-white shadow-md hover:bg-gray-100 text-[#F32947]" />
			</Carousel>
		</section>
	);
}
