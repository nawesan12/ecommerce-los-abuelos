import BrandsCarousel from "@/src/components/perro/BrandsCarousel";
import DogCategories from "@/src/components/perro/CategorieDog";
import HeroPerro from "@/src/components/perro/heroPerro";
import ProductsSection from "@/src/components/products/productsSection";
import React from "react";

export default function Page() {
	return (
		<>
			<HeroPerro />

			<DogCategories />
			<BrandsCarousel />

			<ProductsSection />
		</>
	);
}
