"use client";

import Image from "next/image";
import { Heart } from "lucide-react";

const products = [
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
	{
		title: "Alimento Para Gato Adulto",
		image: "/img/CatFood.png",
		points: 1000,
	},
];

export default function ProductsPoints() {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-16">
			<h2 className="text-[26px] sm:text-[32px] font-extrabold mb-10 text-left">
				PRODUCTOS CANJEABLES
			</h2>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-16">
				{products.map((p, index) => (
					<div
						key={index}
						className="bg-white border border-gray-200 hover:border-[#F32947] transition-all rounded-2xl p-4 shadow-sm hover:shadow-md cursor-pointer">
						{/* Imagen */}
						<div className="relative w-full h-36 sm:h-44 mb-4 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
							<Image
								src={p.image}
								alt={p.title}
								fill
								className="object-contain p-4"
							/>
						</div>

						{/* Info */}
						<div className="flex items-start justify-between">
							<div>
								<p className="text-[14px] sm:text-[15px] font-semibold leading-tight">
									{p.title}
								</p>
								<div className="flex items-center gap-1 mt-1 text-[#0B1D4C] font-semibold">
									<Image
										src="/img/Huella.png"
										alt="Puntos Huella"
										width={25}
										height={25}
										className="object-contain"
									/>
									<span>{p.points}</span>
								</div>
							</div>

							{/* Favorito */}
							<button
								className="text-[#F32947] hover:scale-110 transition"
								onClick={(e) => e.preventDefault()}>
								<Heart size={20} />
							</button>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
