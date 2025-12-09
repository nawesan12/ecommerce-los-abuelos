import Image from "next/image";
import Header from "../components/header";
import ProductCard from "../components/products/ProductCard";
import Hero from "../components/hero";
import SectionCard from "../components/products/categoryCard";
import CategoryCard from "../components/products/categoryCard";
import ProductCarousel from "../components/products/carousel";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import Footer from "../components/footer";
import HomeCarousel from "../components/bannerCarousel";
import CategorySelector from "../components/categorySelector";
import ProductsSection from "../components/products/productsSection";

export default function HomePage() {
	return (
		<div className="text-center pt-12">
			<Hero />
			<CategorySelector />

			<HomeCarousel />
			<ProductCarousel />

			<h1 className="text-1xl md:text-2xl lg:text-3xl font-extrabold text-[#000000] text-left max-w-[1300px] mx-auto mt-16 px-6">
				Filtrar por categoría
			</h1>

			<section className="px-6 py-16 max-w-[1300px] mx-auto">
				{/* Mobile Carousel */}
				<div className="block sm:hidden">
					<Carousel className="w-full max-w-sm mx-auto relative">
						<CarouselContent className="-ml-1 snap-x snap-mandatory">
							<CarouselItem className="basis-full flex justify-center snap-center">
								<div className="scale-[1.1]">
									<CategoryCard
										title="-"
										image="/img/Gato.png"
										count={84}
										href="/categoria/comida"
									/>
								</div>
							</CarouselItem>
							<CarouselItem className="basis-full flex justify-center snap-center">
								<div className="scale-[1.1]">
									<CategoryCard
										title="-"
										image="/img/Beagle.png"
										count={16}
										href="/categoria/higiene"
									/>
								</div>
							</CarouselItem>
							<CarouselItem className="basis-full flex justify-center snap-center">
								<div className="scale-[1.1]">
									<CategoryCard
										title="Humedos"
										image="/img/Huella.png"
										count={42}
										href="/categoria/accesorios"
									/>
								</div>
							</CarouselItem>
						</CarouselContent>
						<CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-20" />
						<CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-20" />
					</Carousel>
				</div>

				{/* Desktop Grid */}
				<div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
					<CategoryCard
						title="ALIMENTOS SECOS"
						image="/img/Gato.png"
						count={84}
						href="/categoria/comida"
					/>
					<CategoryCard
						title="ALIMENTOS HUMEDOS"
						image="/img/Beagle.png"
						count={16}
						href="/categoria/higiene"
					/>
					<CategoryCard
						title="ALIMENTOS ESPECIALES"
						image="/img/Huella.png"
						count={42}
						href="/categoria/accesorios"
					/>
				</div>
			</section>

			<ProductsSection />
		</div>
	);
}
