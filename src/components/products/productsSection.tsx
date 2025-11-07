// src/components/products/productsSection.tsx
import ProductCard from "./ProductCard";

export default function ProductsSection() {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-16">
			<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
				{/* Sidebar de Filtros */}
				<aside className="space-y-10">
					{/* Categoría */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Categoría
						</h3>
						<ul className="space-y-2 text-sm text-gray-600">
							<li className="hover:text-[#F32947] cursor-pointer">
								Perro
							</li>
							<li className="hover:text-[#F32947] cursor-pointer">
								Gato
							</li>
							<li className="hover:text-[#F32947] cursor-pointer">
								Accesorios
							</li>
						</ul>
					</div>

					{/* Precio */}
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
								Royal Canin
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									className="accent-[#F32947]"
								/>{" "}
								Pedigree
							</label>
							<label className="flex items-center gap-2">
								<input
									type="checkbox"
									className="accent-[#F32947]"
								/>{" "}
								Whiskas
							</label>
						</div>
					</div>

					{/* Tags */}
					<div>
						<h3 className="font-semibold text-gray-800 mb-3 text-sm">
							Filtrar por Etiquetas
						</h3>
						<div className="flex flex-wrap gap-2 text-xs">
							<span className="px-3 py-1 border rounded-full cursor-pointer hover:border-[#F32947] transition">
								Comida perro
							</span>
							<span className="px-3 py-1 border rounded-full cursor-pointer hover:border-[#F32947] transition">
								Comida gato
							</span>
							<span className="px-3 py-1 border rounded-full cursor-pointer hover:border-[#F32947] transition">
								Premium
							</span>
							<span className="px-3 py-1 border rounded-full cursor-pointer hover:border-[#F32947] transition">
								Económico
							</span>
						</div>
					</div>
				</aside>

				{/* Sección de productos */}
				<div className="space-y-10">
					{/* Barra superior */}
					<div className="flex justify-between items-center text-sm text-gray-600">
						<p>Mostrando 12 resultados</p>

						<select className="border rounded-md px-3 py-1">
							<option>Ordenar por precio</option>
							<option>Ordenar por nombre</option>
							<option>Más vendidos</option>
						</select>
					</div>

					{/* Grid de productos */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
						<ProductCard
							title={"Alimento para perro Pedigree Adulto 21KG"}
							image={"/img/11.png"}
							price={200}
							href={""}
						/>
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
