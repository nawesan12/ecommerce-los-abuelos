"use client";
import HeroFavoritos from "@/src/components/liked/HeroFavoritos";
import { Heart } from "lucide-react";
import Image from "next/image";

const fakeProducts = Array(12).fill({
	title: "Alimento para perro 20kg",
	price: "$1.000",
	image: "/img/11.png",
});

export default function LikedPage() {
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
				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
					{fakeProducts.map((p, i) => (
						<div
							key={i}
							className="group bg-white rounded-xl border border-gray-200 hover:border-[#F32947] transition-all p-4 shadow-sm hover:shadow-md cursor-pointer">
							<div className="relative w-full h-40 bg-gray-50 rounded-lg overflow-hidden flex justify-center items-center">
								<Image
									src={p.image}
									alt={p.title}
									fill
									className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
								/>
							</div>

							<p className="text-[15px] font-semibold mt-3">
								{p.title}
							</p>

							<div className="flex justify-between items-center mt-1">
								<p className="text-sm text-[#0B1D4C] font-semibold">
									{p.price}
								</p>
								<Heart
									size={18}
									className="text-[#F32947] fill-[#F32947]"
								/>
							</div>
						</div>
					))}
				</div>

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
