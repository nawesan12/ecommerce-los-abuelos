"use client";
import HeroFavoritos from "@/src/components/liked/HeroFavoritos";
import { useLikedStore } from "@/src/stores/liked-store";
import { getProducts } from "@/lib/products";
import { useEffect, useState } from "react";
import type { Product } from "@/src/types/product";
import ProductCard from "@/src/components/products/ProductCard";
import { toast } from "sonner";

export default function LikedPage() {
	const { likedIds } = useLikedStore();
	const [products, setProducts] = useState<Product[]>([]);

	useEffect(() => {
		getProducts().then((all) => {
			setProducts(all.filter((p) => likedIds.includes(p.id)));
		});
	}, [likedIds]);

	useEffect(() => {
		if (likedIds.length === 0) {
			toast.info("Todavía no agregaste productos a favoritos ❤️");
		}
	}, [likedIds]);

	return (
		<div>
			<HeroFavoritos />

			<section className="max-w-[1300px] mx-auto px-6 py-12">
				<h2 className="text-[22px] sm:text-[26px] font-extrabold mb-6">
					MIS PRODUCTOS FAVORITOS
				</h2>

				{/* Opciones superiores */}
				<div className="flex justify-between items-center text-sm text-gray-600 mb-6">
					<p>Mostrando 1-12 de 12 resultados</p>
					<select className="border rounded-lg px-3 py-2">
						<option>Ordenar por más recientes</option>
						<option>Precio menor a mayor</option>
						<option>Precio mayor a menor</option>
					</select>
				</div>

				{/* Grid de productos */}
				{products.length === 0 ? (
					<p className="text-gray-500">
						Todavía no agregaste productos a favoritos ❤️
					</p>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
						{products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))}
					</div>
				)}

				{/* Paginación */}
				<div className="flex justify-center mt-10">
					<button className="px-4 py-2 border rounded-lg mx-1">
						1
					</button>
					<button className="px-4 py-2 border rounded-lg mx-1">
						2
					</button>
				</div>
			</section>
		</div>
	);
}
