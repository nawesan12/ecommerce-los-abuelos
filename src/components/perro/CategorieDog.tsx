"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";

const categories = [
	{
		title: "Alimento Para Perro Adulto",
		image: "/img/CatFood.png",
		count: 84,
		filter: "Adulto",
	},
	{
		title: "Alimento Para Cachorro",
		image: "/img/CatFood.png",
		count: 84,
		filter: "Cachorro",
	},
	{
		title: "Alimento Específico",
		image: "/img/CatFood.png",
		count: 84,
		filter: "Especial",
	},
	{
		title: "Alimentos Húmedos",
		image: "/img/CatFood.png",
		count: 84,
		filter: "Humedo",
	},
];

export default function DogCategories({
	selected,
	onSelect,
}: {
	selected: string | null;
	onSelect: (value: string | null) => void;
}) {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-16">
			<h2 className="text-[26px] sm:text-[32px] font-extrabold mb-10 text-left">
				PRODUCTOS PARA PERROS
			</h2>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
				{categories.map((cat) => (
					<button
						key={cat.title}
						onClick={() =>
							onSelect(
								selected === cat.filter ? null : cat.filter
							)
						}
						className={`border rounded-2xl p-5 flex flex-col items-center transition cursor-pointer w-full h-full ${
							selected === cat.filter
								? "border-[#F32947] shadow-md bg-[#fff5f7]"
								: "border-[#F32947] hover:shadow-md"
						}`}>
						<div className="w-24 sm:w-32 h-24 sm:h-32 relative mb-4">
							<Image
								src={cat.image}
								alt={cat.title}
								fill
								className="object-contain"
							/>
						</div>

						<p className="text-[14px] sm:text-[15px] font-semibold text-center mb-1">
							{cat.title}
						</p>

						<p className="text-[12px] text-gray-500">
							{cat.count} products
						</p>

						<div className="w-full flex justify-end mt-2">
							<ArrowRight className="text-[#F32947] w-4 h-4" />
						</div>
					</button>
				))}
			</div>
		</section>
	);
}
