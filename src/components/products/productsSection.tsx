"use client";

import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";
import { useEffect } from "react";
import { getProducts } from "@/lib/products";
import type { Product } from "@/src/types/product";

export default function ProductsSection() {
	// ESTADOS DE FILTROS

	const [price, setPrice] = useState(300000);
	const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState("none");

	const [allProducts, setAllProducts] = useState<Product[]>([]);

	useEffect(() => {
		getProducts().then(setAllProducts);
	}, []);

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
		const filtered = allProducts.filter((p) => {
			const priceOk = p.price <= price;

			const brandOk =
				selectedBrands.length === 0 || selectedBrands.includes(p.brand);

			const tagOk =
				selectedTags.length === 0 ||
				selectedTags.some((t) => p.tags.includes(t));

			return priceOk && brandOk && tagOk;
		});

		let sorted = [...filtered];

		if (sort === "price-asc") {
			sorted.sort((a, b) => a.price - b.price);
		} else if (sort === "price-desc") {
			sorted.sort((a, b) => b.price - a.price);
		}

		return sorted;
	}, [allProducts, price, selectedBrands, selectedTags, sort]);

	// PAGINACIÓN

	const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
	const paginated = filtered.slice(
		(page - 1) * ITEMS_PER_PAGE,
		page * ITEMS_PER_PAGE
	);

	const nextPage = () => page < totalPages && setPage(page + 1);
	const prevPage = () => page > 1 && setPage(page - 1);

	// UI

	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-16">
			<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
				{/* ---------------------
           SIDEBAR DE FILTROS
        ---------------------- */}
				<aside className="space-y-10">
					{/* Precio */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Precio
						</h3>

						<input
							type="range"
							min={0}
							max={300000}
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
						<p>Mostrando {paginated.length} resultados</p>

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

					<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
						{paginated.map((product) => (
							<ProductCard
								key={product.id}
								title={product.title}
								image={product.image}
								price={product.price}
								href={`/producto/${product.id}`}
							/>
						))}
					</div>

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
