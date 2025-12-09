"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function ProductView({
	product,
	similares,
	weights,
}: {
	product: any;
	similares: any[];
	weights: string[];
}) {
	const [selectedWeight, setSelectedWeight] = useState(weights[2]);
	const [quantity, setQuantity] = useState(1);

	const incrementar = () => setQuantity((q) => q + 1);
	const disminuir = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

	return (
		<>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
				{/* Imagen */}
				<div className="flex justify-center">
					<div className="relative w-[320px] h-[420px]">
						<Image
							src={product.image}
							alt={product.title}
							fill
							className="object-contain"
						/>
					</div>
				</div>

				{/* Info */}
				<div>
					<h1 className="text-[28px] font-bold text-[#0B1D4C] leading-tight">
						{product.title}{" "}
						{selectedWeight && `- ${selectedWeight}`}
					</h1>

					<p className="text-[26px] font-semibold mt-2">
						${product.price.toLocaleString("es-AR")}
					</p>

					{/* Pesos */}
					<div className="flex gap-3 mt-6">
						{weights.map((w) => (
							<button
								key={w}
								onClick={() => setSelectedWeight(w)}
								className={`px-4 py-2 border rounded-lg text-sm ${
									selectedWeight === w
										? "border-[#F32947] text-[#F32947] font-semibold"
										: "border-gray-400 hover:border-[#F32947] hover:text-[#F32947]"
								}`}>
								{w}
							</button>
						))}
					</div>

					{/* Cantidad */}
					<div className="flex items-center gap-4 mt-8">
						<div className="flex items-center border rounded-full px-3 select-none">
							<button
								onClick={disminuir}
								className="px-3 py-1 text-lg">
								-
							</button>
							<p className="px-2">{quantity}</p>
							<button
								onClick={incrementar}
								className="px-3 py-1 text-lg">
								+
							</button>
						</div>

						<button className="bg-[#F32947] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d91d3a] transition">
							Agregar al carrito
						</button>

						<Heart
							size={26}
							className="cursor-pointer text-[#F32947] hover:scale-110 transition"
						/>
					</div>
				</div>
			</div>

			{/* Descripción */}
			<div className="mt-14">
				<h2 className="text-xl font-semibold text-[#F32947]">
					Descripción
				</h2>
				<p className="mt-3 text-gray-700 leading-relaxed max-w-[800px]">
					{product.description ??
						"Descripción no disponible temporalmente."}
				</p>
			</div>

			{/* Similares */}
			<div className="mt-16">
				<h2 className="text-xl font-semibold">Productos Similares</h2>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-6">
					{similares.map((p) => (
						<Link
							key={p.id}
							href={`/producto/${p.id}`}
							className="border rounded-xl p-4 hover:shadow-md transition bg-white cursor-pointer">
							<div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
								<div className="relative w-[140px] h-[120px]">
									<Image
										src={p.image}
										alt={p.title}
										fill
										className="object-contain"
									/>
								</div>
							</div>
							<p className="font-medium text-sm mt-3">
								{p.title}
							</p>
							<p className="text-xs text-gray-600">
								${p.price.toLocaleString("es-AR")}
							</p>
							<Heart size={18} className="text-[#F32947] mt-1" />
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
