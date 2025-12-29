"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "./ProductCard";
import { getProducts } from "@/lib/products";
import type { Product } from "@/src/types/product";

export default function ProductsSection({
	categoryFilter,
	species,
	searchQuery,
	includeTags,
}: {
	categoryFilter?: "secos" | "humedos" | "especiales" | null;
	species?: "perro" | "gato";
	searchQuery?: string;
	includeTags?: string[];
}) {
	// ESTADOS DE FILTROS

	const [price, setPrice] = useState(100000);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState("none");

	const [allProducts, setAllProducts] = useState<Product[]>([]);

	const productsTopRef = useRef<HTMLElement | null>(null);

	useEffect(() => {
		getProducts().then(setAllProducts);
	}, []);

	useEffect(() => {
		setPage(1);
	}, [
		categoryFilter,
		species,
		price,
		selectedBrands,
		selectedTags,
		sort,
		searchQuery,
	]);

	useEffect(() => {
		if (!categoryFilter && !species) return;
		productsTopRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start",
		});
	}, [categoryFilter, species]);

	const ITEMS_PER_PAGE = 12;

	const brands = [
		"Pedigree",
		"Royal Canin",
		"Whiskas",
		"Vitalcan",
		"Vital-Pet",
		"Eukanuba",
		"Purina",
		"Advance",
	];

	const tags = [
		"comida perro",
		"comida gato",
		"premium",
		"económico",
		"oferta",
	];

	// FILTRADO DE PRODUCTOS

	const filtered = useMemo(() => {
		let result = [...allProducts];

		const tokens =
			searchQuery
				?.trim()
				.toLowerCase()
				.split(/\s+/)
				.filter(Boolean) ?? [];
		const tagTokens = includeTags?.map((t) => t.toLowerCase()) ?? [];

		const matchesSearch = (p: Product) => {
			if (tokens.length === 0) return true;

			return tokens.every((token) => {
				const inTitle = p.title.toLowerCase().includes(token);
				const inBrand = p.brand.toLowerCase().includes(token);
				const inVariants = p.variants.some((v) =>
					v.weight.toLowerCase().includes(token)
				);

				const inTags = p.tags.some((t) =>
					t.toLowerCase().includes(token)
				);

				return inTitle || inBrand || inVariants || inTags;
			});
		};

		if (species) {
			result = result.filter((p) => p.category === species);
		}

		// 🔹 Filtro por categoría (desde Home)
		if (categoryFilter === "secos") {
			result = result.filter(
				(p) => p.tags.includes("seco") || p.tags.includes("secos")
			);
		}

		if (categoryFilter === "humedos") {
			result = result.filter(
				(p) => p.tags.includes("humedo") || p.tags.includes("humedos")
			);
		}

		if (categoryFilter === "especiales") {
			result = result.filter(
				(p) =>
					p.tags.includes("especial") || p.tags.includes("especiales")
			);
		}

		// 🔹 Búsqueda por texto (todas las palabras deben coincidir en algún campo)
		result = result.filter(matchesSearch);

		// 🔹 Filtro adicional por tags explícitos
		if (tagTokens.length > 0) {
			result = result.filter((p) =>
				tagTokens.some((tag) =>
					p.tags.map((t) => t.toLowerCase()).includes(tag)
				)
			);
		}

		// 🔹 Filtros existentes
		result = result.filter((p) => {
			const minPrice = Math.min(...p.variants.map((v) => v.price));
			const priceOk = minPrice <= price;

			const brandOk =
				selectedBrands.length === 0 || selectedBrands.includes(p.brand);

			const tagOk =
				selectedTags.length === 0 ||
				selectedTags.some((t) => p.tags.includes(t));

			return priceOk && brandOk && tagOk;
		});

		// 🔹 Ordenamiento
		if (sort === "price-asc") {
			result.sort((a, b) => {
				const aMin = Math.min(...a.variants.map((v) => v.price));
				const bMin = Math.min(...b.variants.map((v) => v.price));
				return aMin - bMin;
			});
		} else if (sort === "price-desc") {
			result.sort((a, b) => {
				const aMin = Math.min(...a.variants.map((v) => v.price));
				const bMin = Math.min(...b.variants.map((v) => v.price));
				return bMin - aMin;
			});
		}

		return result;
	}, [
		allProducts,
		price,
		selectedBrands,
		selectedTags,
		sort,
		categoryFilter,
		species,
		searchQuery,
	]);

	// PAGINACIÓN

	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);
	const hasSearch = !!searchQuery?.trim();
	const fallbackProducts = !hasSearch ? [] : allProducts.slice(0, 8);

	const nextPage = () => page < totalPages && setPage(page + 1);
	const prevPage = () => page > 1 && setPage(page - 1);

	// UI

	return (
		<section
			ref={productsTopRef}
			className="w-full max-w-[1300px] mx-auto px-6 py-16">
			<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
				{/* ---------------------
           SIDEBAR DE FILTROS
        ---------------------- */}
				<aside className="space-y-10">
					{/* Filtrar por Precio */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Precio
						</h3>

						<input
							type="range"
							min={0}
							max={100000}
							value={price}
							onChange={(e) => setPrice(Number(e.target.value))}
							className="w-full accent-[#F32947]"
						/>

						<div className="flex items-center justify-between text-sm mt-2">
							<span className="text-gray-600">$0</span>
							<span className="text-gray-600">
								${price.toLocaleString()}
							</span>
						</div>
					</div>

					{/* Marca */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Marca
						</h3>

						<div className="space-y-2 text-sm text-gray-600">
							{brands.map((brand) => (
								<label
									key={brand}
									className="flex items-center gap-2">
									<input
										type="checkbox"
										className="accent-[#F32947]"
										checked={selectedBrands.includes(brand)}
										onChange={() =>
											setSelectedBrands((prev) =>
												prev.includes(brand)
													? prev.filter(
															(b) => b !== brand
													  )
													: [...prev, brand]
											)
										}
									/>
									{brand}
								</label>
							))}
						</div>
					</div>

					{/* Tags */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Etiquetas
						</h3>

						<div className="flex flex-wrap gap-2 text-xs">
							{tags.map((tag) => {
								const active = selectedTags.includes(tag);

								return (
									<span
										key={tag}
										onClick={() =>
											setSelectedTags((prev) =>
												active
													? prev.filter(
															(t) => t !== tag
													  )
													: [...prev, tag]
											)
										}
										className={`px-3 py-1 border rounded-full cursor-pointer transition 
                      ${
							active
								? "bg-[#F32947] text-white border-[#F32947]"
								: "hover:border-[#F32947]"
						}`}>
										{tag}
									</span>
								);
							})}
						</div>
					</div>
				</aside>

				{/*LISTA DE PRODUCTOS */}
				<div className="space-y-10">
					<div className="flex justify-between items-center text-sm text-gray-600">
						<p>
							{hasSearch
								? `Mostrando ${filtered.length} resultados para "${searchQuery}"`
								: `Mostrando ${paginated.length} resultados`}
						</p>

						<select
							value={sort}
							onChange={(e) => setSort(e.target.value)}
							className="border rounded-md px-3 py-1">
							<option value="none">Sin ordenar</option>
							<option value="price-asc">
								Precio: Menor a Mayor
							</option>
							<option value="price-desc">
								Precio: Mayor a Menor
							</option>
						</select>
					</div>

					{hasSearch && filtered.length === 0 ? (
						<div className="space-y-6">
							<p className="text-gray-700 font-semibold">
								El resultado de la búsqueda de "{searchQuery}"
								{" "}no fue encontrado.
							</p>

							{fallbackProducts.length > 0 && (
								<>
									<p className="text-sm text-gray-500">
										Quizás te interesen estos productos:
									</p>
									<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
										{fallbackProducts.map((product) => (
											<ProductCard
												key={product.id}
												product={product}
												variant="default"
											/>
										))}
									</div>
								</>
							)}
						</div>
					) : (
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
							{paginated.map((product) => (
								<ProductCard
									key={product.id}
									product={product}
									variant="default"
								/>
							))}
						</div>
					)}

					{/* PAGINACIÓN */}
					<div className="flex justify-center gap-3 text-sm">
						<button
							disabled={page === 1}
							onClick={prevPage}
							className="px-3 py-1 border rounded-full disabled:opacity-40">
							← Anterior
						</button>

						{Array.from({ length: totalPages }, (_, i) => (
							<button
								key={i}
								onClick={() => setPage(i + 1)}
								className={`px-3 py-1 border rounded-full ${
									page === i + 1
										? "bg-[#F32947] text-white"
										: ""
								}`}>
								{i + 1}
							</button>
						))}

						<button
							disabled={page === totalPages}
							onClick={nextPage}
							className="px-3 py-1 border rounded-full disabled:opacity-40">
							Siguiente →
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
