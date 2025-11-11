import ProductCard from "./ProductCard";
import { products } from "@/src/data/products";

export default function ProductsSection() {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-16">
			<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
				{/* SIDEBAR */}
				<aside className="space-y-10">
					{/* Filtrar por Precio */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Precio
						</h3>
						<input
							type="range"
							className="w-full accent-[#F32947]"
						/>
						<div className="flex items-center justify-between text-sm mt-2">
							<span className="text-gray-600">$50</span>
							<span className="text-gray-600">$5000</span>
						</div>
						<button className="mt-3 px-4 py-1 text-sm bg-[#F32947] text-white rounded-md hover:bg-[#d9203d] transition">
							Aplicar
						</button>
					</div>

					{/* Marca */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Marca
						</h3>
						<div className="space-y-2 text-sm text-gray-600">
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									className="accent-[#F32947]"
								/>{" "}
								Advance
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									className="accent-[#F32947]"
								/>{" "}
								Royal Canin
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									className="accent-[#F32947]"
								/>{" "}
								Pedigree
							</label>
						</div>
					</div>
				</aside>

				{/* PRODUCTOS */}
				<div className="space-y-10">
					{/* Barra Superior */}
					<div className="flex justify-between items-center text-sm text-gray-600">
						<p>Mostrando {products.length} resultados</p>
						<select className="border rounded-md px-3 py-1">
							<option>Ordenar por precio</option>
							<option>Ordenar por nombre</option>
							<option>Más vendidos</option>
						</select>
					</div>

					{/* GRID */}
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
						{products.map((p) => (
							<ProductCard
								key={p.id}
								title={p.title}
								image={p.image}
								price={p.price}
								href={`/producto/${p.id}`}
							/>
						))}
					</div>

					{/* Paginación */}
					<div className="flex justify-center gap-3 text-sm">
						<button className="px-3 py-1 border rounded-full">
							1
						</button>
						<button className="px-3 py-1 border rounded-full bg-[#F32947] text-white">
							2
						</button>
						<button className="px-4 py-1 border rounded-full">
							Siguiente →
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}
