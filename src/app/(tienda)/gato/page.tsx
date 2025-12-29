'use client';

import { useState } from "react";
import HeroCat from "@/src/components/gato/HeroCat";
import BrandsCarousel from "@/src/components/perro/BrandsCarousel";
import CatCategories from "@/src/components/gato/CatCategories";
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
			<HeroCat />

			<CatCategories selected={quickFilter} onSelect={setQuickFilter} />
			<BrandsCarousel />

			<ProductsSection
				species="gato"
				searchQuery={searchFromQuick || undefined}
				includeTags={tagFilter}
			/>
		</>
	);
}
