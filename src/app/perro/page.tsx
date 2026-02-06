'use client';

import { useState } from "react";
import BrandsCarousel from "@/src/components/perro/BrandsCarousel";
import DogCategories from "@/src/components/perro/CategorieDog";
import HeroPerro from "@/src/components/perro/heroPerro";
import ProductsSection from "@/src/components/products/productsSection";

export default function Page() {
	const [quickFilter, setQuickFilter] = useState<string | null>(null);

	const searchFromQuick = quickFilter ?? null;
	const tagFilter =
		quickFilter === "humedo" ||
		quickFilter === "especial" ||
		quickFilter === "cachorro" ||
		quickFilter === "adulto"
			? [quickFilter]
			: [];

	return (
		<>
			<HeroPerro />

			<DogCategories selected={quickFilter} onSelect={setQuickFilter} />
			<BrandsCarousel />

			<ProductsSection
				species="perro"
				searchQuery={searchFromQuick || undefined}
				includeTags={tagFilter}
			/>
		</>
	);
}
