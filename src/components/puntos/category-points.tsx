"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

interface Props {
	title: string;
	products: any[];
	userPoints: number;
}

export default function CategoryPoints({ title, products, userPoints }: Props) {
	return (
		<section className="w-full mt-12">
			<h2 className="text-2xl font-bold mb-6">{title}</h2>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
				{products.map((p) => {
					const canRedeem = userPoints >= p.points;

					return (
						<div
							key={p.id}
							className={`relative bg-white border rounded-xl p-4 shadow-sm
                ${canRedeem ? "hover:border-[#F32947]" : "opacity-40"}
              `}>
							{/* Imagen */}
							<div className="relative w-full h-36 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center mb-4">
								<Image
									src={p.image}
									alt={p.title}
									fill
									className="object-contain p-4"
								/>
							</div>

							{/* Info */}
							<p className="font-semibold text-sm">{p.title}</p>

							<div className="flex items-center gap-1 text-[#0B1D4C] font-semibold mt-1">
								<Image
									src="/img/Huella.png"
									width={22}
									height={22}
									alt="points"
								/>
								{p.points}
							</div>

							{/* Botón Canjear */}
							<button
								disabled={!canRedeem}
								className={`mt-3 w-full py-2 rounded-lg text-sm font-semibold transition
                  ${
						canRedeem
							? "bg-[#F32947] text-white hover:bg-[#d71b3a]"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}
                `}>
								{canRedeem ? "Canjear" : "No disponible"}
							</button>

							{/* Favorito */}
							<div className="absolute top-3 right-3">
								<Heart size={18} className="text-[#F32947]" />
							</div>
						</div>
					);
				})}
			</div>
		</section>
	);
}
