import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
	{
		title: "Alimento Para Perro Adulto",
		image: "/img/11.png",
		count: 84,
		href: "/perro/alimento-adulto",
	},
	{
		title: "Alimento Para Cachorro",
		image: "/img/11.png",
		count: 84,
		href: "/perro/cachorro",
	},
	{
		title: "Alimento Específico",
		image: "/img/11.png",
		count: 84,
		href: "/perro/especifico",
	},
	{
		title: "Alimentos Húmedos",
		image: "/img/11.png",
		count: 84,
		href: "/perro/humedos",
	},
];

export default function DogCategories() {
	return (
		<section className="w-full max-w-[1300px] mx-auto px-6 py-16">
			<h2 className="text-[26px] sm:text-[32px] font-extrabold mb-10 text-left">
				PRODUCTOS PARA PERROS
			</h2>

			<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 sm:gap-8">
				{categories.map((cat) => (
					<Link
						key={cat.title}
						href={cat.href}
						className="border border-[#F32947] rounded-2xl p-5 flex flex-col items-center hover:shadow-md transition cursor-pointer">
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
					</Link>
				))}
			</div>
		</section>
	);
}
