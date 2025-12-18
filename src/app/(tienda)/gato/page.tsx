import HeroCat from "@/src/components/gato/HeroCat";
import BrandsCarousel from "@/src/components/perro/BrandsCarousel";
import CatCategories from "@/src/components/perro/CategorieDog";
import DogCategories from "@/src/components/perro/CategorieDog";
import ProductsSection from "@/src/components/products/productsSection";
import React from "react";

export default function Page() {
	return (
		<>
			<HeroCat />

			<CatCategories />
			<BrandsCarousel />

			<ProductsSection species="gato" />
		</>
	);
}
